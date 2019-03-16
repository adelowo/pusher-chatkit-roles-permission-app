import React, { Component } from 'react';

const MessageList = props => {
  return (
    <ul className="message-list">
      {props.messages.map((message, index) => {
        return (
          <li key={message.id} className="message">
            <div>{message.senderId}</div>
            <div>{message.text}</div>
          </li>
        );
      })}
    </ul>
  );
};

class SendMessageForm extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
  }

  handleChange = e => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Type your message and hit ENTER"
          type="text"
        />
      </form>
    );
  }
}

export { MessageList, SendMessageForm };
