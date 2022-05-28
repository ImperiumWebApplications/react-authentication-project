import React, { useState } from "react";

// import React from "react";
export const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const intiialToken = localStorage.getItem("idToken");
  const [token, setToken] = useState(intiialToken);
  const userIsLoggedIn = !!token;
  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("idToken", token);
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
