const express = require('express');
const cors = require('cors'); // Import cors
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5500',
  'https://location-t.vercel.app',
  'https://playful-nasturtium-ef9858.netlify.app',
];

// CORS configuration for Express
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

const server = createServer(app);

// CORS configuration for Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('location', message => {
    console.log(message);
    io.emit('location', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
