import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Moment from 'react-moment';
import './Chat.css';

let socket;

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      globalMessage: {},
      messages: [],
      newMessage: '',
      userLocation: '',
      disabled: false,
      endpoint: 'http://localhost:5000/'
    };

    socket = socketIOClient(this.state.endpoint);
  }

  componentDidMount() {
    console.log(this.props);
    const { globalMessage } = this.state;
    socket.on('countUpdated', newCount => this.setState({ count: newCount }));
    socket.on('message', globalMessage => this.setState({ globalMessage }));

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
          this.setState({ globalMessage: Object.assign({}, globalMessage) });
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
    socket.emit('increment');
    socket.on('countUpdated', newCount => this.setState({ count: newCount }));
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ disabled: true });

    const { newMessage } = this.state;
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
    const { globalMessage, messages, disabled } = this.state;
    return (
      <div className="main">
        <h1>
          {globalMessage.text}
          <span>
            <Moment format="h:mm a">{globalMessage.createdAt}</Moment>
          </span>
        </h1>
        <div className="messages">
          {messages.map((message, idx) => (
            <div
              className={idx % 2 === 0 ? 'dark' : 'light'}
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

export default Chat;
