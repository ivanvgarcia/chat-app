const { generateMessage } = require('../utils/messages');

module.exports = function(socket) {
  socket.emit('message', generateMessage('Welcome Brown People'));
};
