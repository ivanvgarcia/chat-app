import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

const JoinChat = ({ history }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    history.push(`/chat/${username}/${room}`);
  };

  return (
    <div>
      <h1>Join Chat</h1>
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
          required
        />
        <button>Join</button>
      </form>
    </div>
  );
};

export default withRouter(JoinChat);
