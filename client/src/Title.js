import React from 'react';

const Title = props => {
  return (
    <p className="title">
      {props.title.trim() ? props.title.trim() : 'Chat room'}
    </p>
  );
};

export default Title;
