import React from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { SendMessageForm, MessageList } from './Message';
import Title from './Title';
import './App.css';

const instanceLocator = 'v1:us1:feaa87a8-804f-48e3-9cb4-2a1d10cca255';
const roomId = 'ROOM_ID';

class Chat extends React.Component {
  state = {
    messages: [],
    currentUser: null,
  };

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: this.props.username,
      tokenProvider: new TokenProvider({
        url: 'http://localhost:5200/authenticate',
      }),
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });

        this.state.currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message],
              });
            },
          },
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendMessage = text => {
    this.state.currentUser.sendMessage({
      text,
      roomId: roomId,
    });
  };

  render() {
    return (
      <div className="app">
        <Title title={''} />
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages}
        />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    );
  }
}

export default Chat;
