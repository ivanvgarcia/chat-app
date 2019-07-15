import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      message: '',
      messages: [],
      newMessage: '',
      userLocation: '',
      disabled: false,
      endpoint: 'http://localhost:5000'
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('countUpdated', newCount => this.setState({ count: newCount }));
    socket.on('message', message => this.setState({ message }));
    socket.on('allMessages', messages =>
      this.setState({ messages: [...messages] })
    );

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
        'sendLocation',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        message => {
          this.setState({ message });
        }
      );
      socket.on('userLocation', location =>
        this.setState({ userLocation: location })
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this._input.focus();
  }

  incrementCount = () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('increment');
    socket.on('countUpdated', newCount => this.setState({ count: newCount }));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ disabled: true });

    const { endpoint, messages, newMessage } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('sendMessage', newMessage, message => {
      console.log('the message was delivered', message);
    });
    socket.on('allMessages', messages =>
      this.setState({
        messages: [...messages],
        newMessage: '',
        disabled: false
      })
    );
  };

  createMarkup = message => {
    return { __html: message };
  };

  render() {
    const { userLocation, message, messages, disabled } = this.state;
    return (
      <div className="main">
        <h1>{message}</h1>
        <div className="messages">
          {messages.map((message, idx) => (
            <div
              className={idx % 2 == 0 ? 'dark' : 'light'}
              dangerouslySetInnerHTML={this.createMarkup(message)}
            />
          ))}
        </div>
        <form onSubmit={this.handleSubmit} className="form">
          <input
            onChange={this.handleChange}
            name="newMessage"
            value={this.state.newMessage}
            type="text"
            autoFocus
            ref={c => (this._input = c)}
          />
          <button disabled={disabled}>Send Message</button>
        </form>
      </div>
    );
  }
}

export default App;
