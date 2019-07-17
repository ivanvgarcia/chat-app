import React, { useEffect } from 'react';
import Chat from './pages/Chat';
import JoinChat from './pages/JoinChat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SocketContext from './SocketContext';
import * as io from 'socket.io-client';
const socket = io('http://localhost:5000/');

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Route path="/" exact component={JoinChat} />
        <Route path="/chat/:username/:room" exact component={Chat} />
      </Router>
    </SocketContext.Provider>
  );
};

export default App;
