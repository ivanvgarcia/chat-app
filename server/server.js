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
const { generateMessage } = require('../utils/messages');

app.use(cors());
app.use(express.static(publicPath));

let count = 0;

let chat = [];
let userLocation;

io.on('connection', socket => {
  console.log('New user connected');
  socket.on('subscribeToTimer', interval => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  socket.emit('message', generateMessage('Welcome to the Chat Application'));
  socket.broadcast.emit('message', generateMessage('A new user has Joined'));

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
    chat.push(`<a href=${userLocation}>My Current Location</a>`);
    io.emit('allMessages', chat);
    callback('location sent');
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A User Left'));
  });
});

app.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

server.listen(port, () => console.log(`server is running on port ${port}.`));
