import React from 'react';
import Chat from './pages/Chat';
import JoinChat from './pages/JoinChat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={JoinChat} />
      <Route path="/chat/:username" exact component={Chat} />
    </Router>
  );
};

export default App;
