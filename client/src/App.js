import React from 'react';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import axios from 'axios';

class App extends React.Component {
  state = {
    username: '',
    isUserAdmin: false,
  };

  logIn = username => {
    if (username.trim().length === 0) {
      alert('Please provide your username');
      return;
    }

    axios
      .post('http://localhost:5200/users', { username })
      .then(res => {
        this.setState({ username, isUserAdmin: res.data.is_admin });
      })
      .catch(err => {
        console.log(err);
        alert('We could not log you in');
      });
  };

  render() {
    if (this.state.username === '') {
      return <Login login={this.logIn} />;
    }

    return (
      <Chat isAdmin={this.state.isUserAdmin} username={this.state.username} />
    );
  }
}

export default App;
