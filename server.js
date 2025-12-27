const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const { startExpireJob } = require('./jobs/expireListings');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Make io available to routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'RescueRoute API is running',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rescueroute');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/stats', require('./routes/stats'));

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

