import React from "react";

export const Users = ({ onClick, users }) => {
  return (
    <div>
      <button onClick={onClick}>Load</button>
      {users.map(user => (
        <div>{user.name}</div>
      ))}
    </div>
  );
};
