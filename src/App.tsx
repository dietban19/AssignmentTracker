import { useState, useEffect, useContext } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Main from "./pages/main/main";
import Signup from "./pages/auth/signup.js";
import Profile from "./pages/profile/profile";
import { UserContext } from "./context/userContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, loadingAuthState } = useContext(UserContext);
  // const [loading, setLoading] = useState(true);

  const allowedPaths = ["/main", "/profile"];

  useEffect(() => {
    if (loadingAuthState) return; // Wait until the auth check is done
    if (allowedPaths.includes(currentPath)) return;
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/main");
    }
  }, [user, navigate, loadingAuthState]);
  if (loadingAuthState) {
    return <div className="lds-hourglass"></div>; // Or some spinner/loading UI
  }
  return (
    <>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
