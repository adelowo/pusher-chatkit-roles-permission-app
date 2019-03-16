import React, { useState } from 'react';

const Popup = props => {
  const [value, setValue] = useState('');
  const [disableButtons, setButtonState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="popup">
      <div className="popup_inner">
        <h1>{props.text}</h1>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <input
          type="text"
          value={value}
          placeholder={'user ID'}
          onChange={e => setValue(e.target.value)}
        />
        <button
          type="submit"
          onClick={() => {
            setButtonState(true);
            props
              .handleInput(value)
              .then(() => {
                setValue('');
                setButtonState(false);
                setErrorMessage(''); // clear any previous error message
                alert('Success');
              })
              .catch(err => {
                let message = err.info.error_description;

                if (
                  err.info.error ===
                  'services/chatkit_authorizer/authorization/missing_permission'
                ) {
                  message =
                    "You don't have enough permissions to perform this action";
                }

                setErrorMessage(message);
                setButtonState(false);
                console.log(err);
              });
          }}
          disabled={disableButtons}
        >
          Submit
        </button>
        <button
          style={{ backgroundColor: 'red' }}
          onClick={() => {
            props.dismiss();
          }}
          disabled={disableButtons}
        >
          Close modal
        </button>
      </div>
    </div>
  );
};

export default Popup;
