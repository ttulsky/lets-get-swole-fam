// src/authContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth, firestore, storage } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser(user);
          setUserName(userDoc.data().name);
          localStorage.setItem("authToken", user.accessToken);

          // Fetch the profile image URL
          const fileRef = ref(storage, `profileImages/${user.uid}`);
          try {
            const url = await getDownloadURL(fileRef);
            setProfileImageURL(url);
          } catch (error) {
            console.error("Error fetching profile image URL:", error);
          }
        }
      } else {
        setCurrentUser(null);
        setUserName(null);
        setProfileImageURL(null);
        localStorage.removeItem("authToken");
      }
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserName(null);
    setProfileImageURL(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userName, profileImageURL, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
