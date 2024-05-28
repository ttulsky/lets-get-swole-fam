import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem("authToken", user.accessToken);
      } else {
        localStorage.removeItem("authToken");
      }
    });
    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      setCurrentUser(null);
      localStorage.removeItem("authToken");
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
