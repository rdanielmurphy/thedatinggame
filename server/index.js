require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const discoveryRoutes = require('./routes/discovery');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const { setupDevBot } = require('./dev-bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/matches', matchRoutes);
// Dev bot auto-reply middleware (only active in non-production)
const devBotMiddleware = setupDevBot(io);
if (devBotMiddleware) {
  app.use('/api/messages', devBotMiddleware);
}

app.use('/api/messages', messageRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  console.log(`User connected: ${socket.userId}`);

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('send_message', async ({ conversationId, text }) => {
    try {
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        text,
      });
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });
      const populated = await message.populate('sender', 'name photos');
      io.to(conversationId).emit('new_message', populated);
    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('user_typing', { userId: socket.userId });
  });

  socket.on('stop_typing', ({ conversationId }) => {
    socket.to(conversationId).emit('user_stop_typing', { userId: socket.userId });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
