require('dotenv').config();
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
const mongoose = require('mongoose');
const User = require('../models/User');
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log('You have been connected to MONGO ATLAS'));
app.use(cors());

let chat = [];
let userLocation;

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', async ({ username, room }, callback) => {
    // const user = await User.create({ name: username, room });
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
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left the building!`)
      );
    }
  });
});

app.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

server.listen(port, () => console.log(`server is running on port ${port}.`));
