import React, { useState } from "react";

// import React from "react";
export const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  // Calculate remaining time for the token
  // expirationTime needs to converted to date object
  const expirationDate = new Date(expirationTime);
  const currentDate = new Date();
  const remainingTime = expirationDate.getTime() - currentDate.getTime();
  return remainingTime;
};

const AuthContextProvider = (props) => {
  const intiialToken = localStorage.getItem("idToken");
  const [token, setToken] = useState(intiialToken);
  const userIsLoggedIn = !!token;

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("idToken", token);
    const remainingTime = calculateRemainingTime(expirationTime);
    // Remove the idToken from localStorage after the remaining time
    setTimeout(() => {
      logoutHandler();
    }, remainingTime);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("idToken");
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
