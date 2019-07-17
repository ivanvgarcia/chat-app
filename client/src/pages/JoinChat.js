import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import SocketContext from '../SocketContext';

const JoinChat = ({ socket, history, match, ...props }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [alert, setAlert] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    socket.emit('join', { username, room }, error => {
      if (error) {
        return setAlert(error);
      }
      history.push(`/chat/${username}/${room}`);
    });
  };

  return (
    <div>
      <h1>Join Chat</h1>
      {alert}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">User Name</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <label htmlFor="room"> Room </label>
        <input
          type="text"
          name="room"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button>Join</button>
      </form>
    </div>
  );
};

const JoinChatSocket = props => (
  <SocketContext.Consumer>
    {socket => <JoinChat {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default withRouter(JoinChatSocket);
