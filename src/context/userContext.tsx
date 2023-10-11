import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  UserCredential
} from "firebase/auth";
import { auth, db } from "../config/firebase.js";
import {useNavigate} from 'react-router-dom'
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
type UserType = {
  user: User | null;
  loadingAuthState: boolean;
  setLoadingAuthState: (value: boolean) => void;
  googleSignIn: () => void;
};
export const UserContext = React.createContext<UserType>({
  user: null,
  loadingAuthState: true,
  setLoadingAuthState: () => {},
  googleSignIn: () => {}
});


const provider = new GoogleAuthProvider();
export function useUserContext() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: React.ReactNode;
}
export const UserProvider: React.FC<UserProviderProps>= ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  // console.log(db);
const navigate = useNavigate();
  async function addNewGoogleUser(result:UserCredential) {
    if(result.user){
      const addUserData = {
        username: result.user?.email?.split("@")[0],
        id: result.user.uid,
        email: result.user.email,
        photoURL: "",
        loggedIn: true,
        // groups: [],
      };
      console.log(addUserData);
      const userDocRef = doc(db, "users", result.user.uid);
      await setDoc(userDocRef, addUserData);
    }else{

    }

  }
  const googleSignIn =async()=> {
    console.log(auth);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const userData = getAdditionalUserInfo(result);
        if (userData && userData.isNewUser) {
          console.log("NEW USER");
          addNewGoogleUser(result);
        }
      } else {
        console.error("No user from signInWithPopup");
      }
      
      navigate("/home");
    } catch {
      (error: FirebaseError) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      };
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          console.log(currentUser.uid);
          //reference the user document
          console.log(1);
          const userDocRef = doc(db, "users", currentUser.uid);
          //check if the user already exists

          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log("ADDING USER");
            // If not, add the user to Firestore
            const userData = {
              uid: currentUser.uid,
              email: currentUser.email,
              // Add other necessary user data you want to store
            };
            await setDoc(userDocRef, userData);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error during authentication state change:", err);
      } finally {
        // console.log("SETING false");
        setLoadingAuthState(false);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);
  const values = {
    user,
    loadingAuthState,
    setLoadingAuthState,
    googleSignIn,
  };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
