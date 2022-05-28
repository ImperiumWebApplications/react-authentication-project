import React, { useEffect, useState } from "react";

let logoutTimer;

// import React from "react";
export const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationDateString) => {
  // Calculate remaining time for the token
  // expirationDateString needs to converted to date object
  const expirationDate = new Date(expirationDateString);
  const currentDate = new Date();
  const remainingTime = expirationDate.getTime() - currentDate.getTime();
  return remainingTime;
};

const retrieveStoredToken = () => {
  // Retrieve token from the local storage if it has not expired
  const storedToken = localStorage.getItem("idToken");
  if (!storedToken) {
    return null;
  }
  const expirationDate = localStorage.getItem("expirationDate");
  const remainingTime = calculateRemainingTime(expirationDate);
  if (remainingTime > 0) {
    return {
      token: storedToken,
      expirationTime: remainingTime,
    };
  }
  // Remove the token and expiration date from local storage
  localStorage.removeItem("idToken");
  localStorage.removeItem("expirationDate");
  return null;
};

const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  const intiialToken = tokenData?.token;
  const [token, setToken] = useState(intiialToken);
  const userIsLoggedIn = !!token;

  useEffect(() => {
    console.log(tokenData?.expirationTime);
    if (token) {
      logoutTimer = setTimeout(() => {
        logoutHandler();
      }, tokenData?.expirationTime);
    }
  }, [tokenData, token]);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("idToken", token);
    // Set the expiration time to local storage
    localStorage.setItem("expirationDate", expirationTime);
    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(() => {
      logoutHandler();
    }, remainingTime);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("idToken");
    localStorage.removeItem("expirationDate");
    clearTimeout(logoutTimer);
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
