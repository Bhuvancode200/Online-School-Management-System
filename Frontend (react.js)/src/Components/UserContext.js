import React, { createContext, useState, useContext } from 'react';

// Create the UserContext with a default value of null
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap the application and share the context
export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext };