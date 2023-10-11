import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useUserContext } from "../../context/userContext";
import "./signup.css";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../../config/firebase.js";
const provider = new GoogleAuthProvider();
const signup = () => {
  const [loading, setLoading] = useState(false);
  const { googleSignIn } = useUserContext();
  async function signInWithGoogle() {
    try {
      setLoading(true);
      console.log("STEP 1");
      await googleSignIn();
      setLoading(false);
    } catch {
      //   console.log(showAlert);
      // setError("Failed to Create Account");
    }
  }
  return (
    <div className="signup-container">
      {loading ? (
        <div className="lds-hourglass"></div>
      ) : (
        <div className="signup-card">
          <button className="signup-btn" onClick={signInWithGoogle}>
            <span>Sign in with Google</span>
            <FcGoogle size={25} />
          </button>
        </div>
      )}
    </div>
  );
};

export default signup;
