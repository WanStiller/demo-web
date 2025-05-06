const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Usar el puerto que Render asigna automáticamente
const port = process.env.PORT || 3000;
const io = socketIo(server);

// Cuando se recibe la oferta de conexión
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor de señalización escuchando en el puerto ${port}`);
});

