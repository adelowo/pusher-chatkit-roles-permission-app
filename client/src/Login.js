import React, { useState } from 'react';
import Title from './Title';

const Login = props => {
  const [input, setInput] = useState('');
  const [isLoginButtonDisabled, setLoginButtonClickStatus] = useState(false);

  return (
    <div className="app">
      <Title title={'Login page'} />

      <div className="login-box">
        <div className="login-form">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Username"
          />
          <br />
          <button
            type="submit"
            onClick={() => {
              setLoginButtonClickStatus(!isLoginButtonDisabled);
              props.login(input);
            }}
            className="login-button"
            disabled={isLoginButtonDisabled}
          >
            Login
          </button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Login;
