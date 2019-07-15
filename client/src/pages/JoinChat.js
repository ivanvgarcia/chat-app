import React from 'react';
import { withRouter } from 'react-router-dom';

const JoinChat = ({ history }) => {
  const handleSubmit = e => {
    e.preventDefault();
    history.push(`/chat/ivan`);
  };
  return (
    <div>
      <h1>Join Chat</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">User Name</label>
        <input type="text" name="username" placeholder="username" required />
        <label htmlFor="room"> Room </label>
        <input type="text" name="room" required />
        <button>Join</button>
      </form>
    </div>
  );
};

export default withRouter(JoinChat);
