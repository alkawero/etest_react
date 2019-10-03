import React from 'react';

const UserContext = React.createContext({});

const UserProvider = (props) => {
  return (
    <UserContext.Provider value={props.user}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };