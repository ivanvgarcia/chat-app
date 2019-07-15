const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const io = socketIO(server);
const cors = require('cors');

app.use(cors());
app.use(express.static(publicPath));

let count = 0;
const message = 'Welcome to Chat App';
let chat = [];
let userLocation;

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('message', message);
  socket.broadcast.emit('message', 'A new user has joined');

  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    count++;
    io.emit('countUpdated', count);
  });

  socket.on('sendMessage', (message, callback) => {
    console.log(chat);
    chat.push(`<p>${message}</p>`);
    io.emit('allMessages', chat);
    callback('Delivered!');
  });

  socket.on('sendLocation', (location, callback) => {
    userLocation = `https://google.com/maps/?q=${location.latitude},${
      location.longitude
    }`;
    chat.push(`<a href=${userLocation}>New User Joined</a>`);
    io.emit('allMessages', chat);
    callback('location sent');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

app.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

server.listen(port, () => console.log(`server is running on port ${port}.`));
