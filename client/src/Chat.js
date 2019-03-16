import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { SendMessageForm, MessageList } from './Message';
import Title from './Title';
import Popup from './Popup';
import './App.css';

const instanceLocator = 'v1:us1:feaa87a8-804f-48e3-9cb4-2a1d10cca255';
const ROOM_ID = '19385842';

class Chat extends Component {
  state = {
    messages: [],
    currentUser: null,
    showPopup: false,
    popUpText: '',
    handleInput: null,
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
          roomId: ROOM_ID,
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

  dismissModal = () => {
    this.setState({ showPopup: false });
  };

  deleteUserFromRoom = () => {
    const fn = username => {
      return this.state.currentUser.removeUserFromRoom({
        userId: username,
        roomId: ROOM_ID,
      });
    };

    this.setState({
      handleInput: fn,
      showPopup: true,
      popUpText: 'Remove a user from this room',
    });
  };

  addUserToRoom = () => {
    const fn = username => {
      return this.state.currentUser.addUserToRoom({
        userId: username,
        roomId: ROOM_ID,
      });
    };

    this.setState({
      handleInput: fn,
      showPopup: true,
      popUpText: 'Add a user to this room',
    });
  };

  sendMessage = text => {
    this.state.currentUser.sendMessage({
      text,
      roomId: ROOM_ID,
    });
  };

  render() {
    if (this.state.showPopup) {
      return (
        <Popup
          handleInput={this.state.handleInput}
          text={this.state.popUpText}
          dismiss={this.dismissModal}
        />
      );
    }

    const showHeader = this.state.currentUser !== null && this.props.isAdmin;

    return (
      <div className="app">
        <Title title={''} />
        {showHeader && (
          <Header
            addUserToRoom={this.addUserToRoom}
            removeUserFromRoom={this.deleteUserFromRoom}
          />
        )}
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages}
        />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    );
  }
}

const Header = props => {
  return (
    <p className="title">
      <button className="header-button" onClick={() => props.addUserToRoom()}>
        Add user
      </button>
      <button
        className="header-button"
        onClick={() => props.removeUserFromRoom()}
      >
        Remove user
      </button>
    </p>
  );
};

export default Chat;
