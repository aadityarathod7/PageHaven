require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://book-project-frontend.onrender.com', 'http://localhost:5173'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Track connected users
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Join user's room for private notifications
  socket.on('join', (userId) => {
    if (!userId) {
      console.error('No userId provided for room join');
      return;
    }

    // Leave previous room if any
    const previousUserId = [...socket.rooms].find(room => room !== socket.id);
    if (previousUserId) {
      socket.leave(previousUserId);
      console.log(`Socket ${socket.id} left room ${previousUserId}`);
    }

    // Join new room
    socket.join(userId);
    connectedUsers.set(socket.id, userId);

    const roomSize = io.sockets.adapter.rooms.get(userId)?.size || 0;
    console.log(`User ${userId} joined their room with socket ${socket.id}. Room size: ${roomSize}`);
  });

  socket.on('disconnect', (reason) => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(socket.id);
      const roomSize = io.sockets.adapter.rooms.get(userId)?.size || 0;
      console.log(`Client disconnected. Socket: ${socket.id}, User: ${userId}, Reason: ${reason}, Remaining room size: ${roomSize}`);
    } else {
      console.log(`Client disconnected. Socket: ${socket.id}, Reason: ${reason}`);
    }
  });
});

// Make io accessible to our routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: ['https://book-project-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));