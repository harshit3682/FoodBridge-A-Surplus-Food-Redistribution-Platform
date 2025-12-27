const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { startExpireJob } = require("./jobs/expireListings");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io available to routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve static files if needed (for favicon, etc.)
app.use(express.static('public'));

// Favicon route to prevent 404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content
});

// Root route - API information
app.get("/", (req, res) => {
  // If request wants HTML, send a simple page
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RescueRoute API</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
          }
          .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          h1 { margin-top: 0; }
          .endpoint {
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 8px;
            font-family: monospace;
          }
          .status { color: #43e97b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🍽️ RescueRoute API</h1>
          <p class="status">✅ API is running</p>
          <p>This is the backend API server. The frontend application should be deployed separately.</p>
          <h2>Available Endpoints:</h2>
          <div class="endpoint">POST /api/auth/register</div>
          <div class="endpoint">POST /api/auth/login</div>
          <div class="endpoint">GET /api/auth/me</div>
          <div class="endpoint">GET /api/listings/mine</div>
          <div class="endpoint">GET /api/listings/available</div>
          <div class="endpoint">POST /api/listings</div>
          <div class="endpoint">GET /api/claims/mine</div>
          <div class="endpoint">GET /api/claims/received</div>
          <div class="endpoint">POST /api/claims</div>
          <div class="endpoint">GET /api/stats/public</div>
          <div class="endpoint">GET /health</div>
          <p style="margin-top: 30px; opacity: 0.8;">
            <strong>Version:</strong> 1.0.0<br>
            <strong>Timestamp:</strong> ${new Date().toISOString()}
          </p>
        </div>
      </body>
      </html>
    `);
  } else {
    // Return JSON for API clients
    res.status(200).json({
      status: "OK",
      message: "RescueRoute API is running",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        listings: "/api/listings",
        claims: "/api/claims",
        stats: "/api/stats",
        health: "/health"
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "RescueRoute API is running",
    timestamp: new Date().toISOString(),
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/rescueroute"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/listings", require("./routes/listings"));
app.use("/api/claims", require("./routes/claims"));
app.use("/api/stats", require("./routes/stats"));

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();

  // Start the expiry job
  startExpireJob();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
