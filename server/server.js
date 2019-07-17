const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);
const cors = require('cors');
const { generateMessage } = require('../utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('../utils/users');

app.use(cors());

let count = 0;

let chat = [];
let userLocation;

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Welcome to the Chat Application'));

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage(`${user.username} has joined the chat!`)
      );

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    console.log(chat);

    chat.push(`<p>${message}</p>`);

    io.to('test').emit('allMessages', chat);

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
