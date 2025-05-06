const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Dominios permitidos (ajusta según necesites)
const allowedOrigins = ['https://findweb.net', 'https://www.findweb.net'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Inicializar Socket.IO con configuración de CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

// Lógica de señalización (WebRTC signaling)
io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);

  // El usuario se une a una sala (room)
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 Socket ${socket.id} se unió a la sala ${roomId}`);
  });

  // Manejo de la oferta
  socket.on('offer', (offer, roomId) => {
    console.log(`📨 Oferta enviada a la sala ${roomId}`);
    socket.to(roomId).emit('offer', offer);
  });

  // Manejo de la respuesta
  socket.on('answer', (answer, roomId) => {
    console.log(`📨 Respuesta enviada a la sala ${roomId}`);
    socket.to(roomId).emit('answer', answer);
  });

  // Candidatos ICE
  socket.on('ice-candidate', (candidate, roomId) => {
    console.log(`❄️ Candidato ICE para sala ${roomId}`);
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  // Fin de llamada
  socket.on('end-call', () => {
    console.log(`📴 Llamada finalizada por ${socket.id}`);
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    console.log('🔌 Usuario desconectado:', socket.id);
  });
});

server.listen(10000, () => {
  console.log('🚀 Servidor de señalización en puerto 10000');
});

