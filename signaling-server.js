const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['https://findweb.net', 'https://www.findweb.net', 'http://localhost:4200'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

io.on('connection', (socket) => {
  console.log('🔗 Usuario conectado:', socket.id);

  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`🛎️ Usuario ${socket.id} se unió a la sala ${roomId}`);
  });

  socket.on('offer', (offer, roomId) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (answer, roomId) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('end-call', (roomId) => {
    socket.to(roomId).emit('end-call');
    console.log(`📴 Llamada finalizada en sala ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

server.listen(10000, () => {
  console.log('🚀 Servidor escuchando en puerto 10000');
});

