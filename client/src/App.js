import React from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import './App.css';
import { SendMessageForm, MessageList } from './Message';
import Title from './Title';

const instanceLocator = 'v1:us1:feaa87a8-804f-48e3-9cb4-2a1d10cca255';
const roomId = 'ROOM_ID';
const USER_ID = 'USER_ID';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: USER_ID,
      tokenProvider: new TokenProvider({
        url: 'http://localhost:5200/auth',
      }),
    });

    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;
      this.currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
        },
      });
    });
  }

  sendMessage = text => {
    this.currentUser.sendMessage({
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

export default App;
