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
const BASE_PORT = parseInt(process.env.PORT);

// Start server with Port Fallback Logic
const startServer = async () => {
  await connectDB();
  startExpireJob();
  const attemptListen = (port) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  };
  attemptListen(BASE_PORT);
};

// Call the server starter!
startServer();

module.exports = app;
