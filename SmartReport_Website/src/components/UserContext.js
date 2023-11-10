// UserContext.js

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    userId: null,
    role: null,
  });

  const setUserData = (userId, role) => {
    setUser({ userId, role });
  };

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
