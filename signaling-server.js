const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuración de CORS para permitir solicitudes desde tu dominio
const allowedOrigins = ['https://findweb.net', 'https://www.findweb.net'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Inicializar socket.io con configuración de CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Asegúrate de que la URL de tu cliente esté permitida
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  // Aquí va tu lógica de socket (ofertas, respuestas, candidatos)
});

server.listen(10000, () => {
  console.log('Servidor de señalización escuchando en el puerto 10000');
});

