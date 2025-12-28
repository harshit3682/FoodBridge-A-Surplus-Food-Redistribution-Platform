const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { startExpireJob } = require("./jobs/expireListings");

const app = express();

// Middleware
app.use(cors()); // Currently allows all origins (Good for dev, restrict in production)
app.use(express.json());

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
    await mongoose.connect(process.env.MONGODB_URI);
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

// Parse PORT as a number so we can increment it if needed
const BASE_PORT = parseInt(process.env.PORT) || 3000;

const startServer = async () => {
  await connectDB();
  startExpireJob();

  // Listen on the next available port if previous one is in use
  const tryListen = (port) => {
    const server = app
      .listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.warn(`⚠️  Port ${port} in use, trying port ${port + 1}...`);
          tryListen(port + 1);
        } else {
          console.error("Server error:", err);
          process.exit(1);
        }
      });
  };

  tryListen(BASE_PORT);
};

startServer();

module.exports = app;
