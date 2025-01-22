const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configuring Socket.IO for real-time communication
const io = socketIO(server, {
  cors: {
    origin: '*', // Allowing all origins for simplicity; configure as needed for production
    methods: ['GET', 'POST'], // Supported HTTP methods
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Listening for connections and setting up event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data); // Notify others that a user is typing
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping'); // Notify others to stop the typing indicator
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
