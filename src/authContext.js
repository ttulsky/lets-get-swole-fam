import React, { createContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser(user);
          setUserName(userDoc.data().name);
          localStorage.setItem("authToken", user.accessToken);
        }
      } else {
        setCurrentUser(null);
        setUserName(null);
        localStorage.removeItem("authToken");
      }
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserName(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ currentUser, userName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
