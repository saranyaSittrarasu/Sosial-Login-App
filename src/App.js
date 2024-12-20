import React, { useState, useEffect } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Googlelogin from "./Components/Googlelogin";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import { useNavigate } from "react-router-dom";
import {
  getRefreshToken,
  getNewAccessToken,
  getGoogleUserDetails,
} from "./Utils";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const isTokenExpired = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = Number(localStorage.getItem("expiration_time"));
    return expirationTime && currentTime > expirationTime;
  };

  const login = async (tokenResponse) => {
    const refreshtoken = await getRefreshToken(tokenResponse);
    const userDetails = await getGoogleUserDetails(refreshtoken.access_token);
    setUserDetails(userDetails);
    const token = refreshtoken.access_token;
    const refreshToken = refreshtoken.refresh_token;
    //refreshtoken.expires_in;
    localStorage.setItem("google_token", token);
    localStorage.setItem("google_refresh_token", refreshToken);
    const expirationTime = Math.floor(Date.now() / 1000) + 30;
    localStorage.setItem("expiration_time", expirationTime);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("google_token");
    localStorage.removeItem("google_refresh_token");
    localStorage.removeItem("expiration_time");
    setIsLoggedIn(false);
    navigate("/");
  };

  // useEffect(() => {
  //   const storedExpirationTime = localStorage.getItem("expiration_time");
  //   if (storedExpirationTime) {
  //     setExpirationTime(parseInt(storedExpirationTime, 10));
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     if (currentTime > storedExpirationTime) {
  //       handleLogout();
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const generateToken = async () => {
      const refreshToken = localStorage.getItem("google_refresh_token");
      const tokenExpired = isTokenExpired();
      if (tokenExpired) {
        const newToken = await getNewAccessToken(refreshToken);
        localStorage.setItem("google_token", newToken.access_token);
        const expirationTime = Math.floor(Date.now() / 1000) + 30;
        localStorage.setItem("expiration_time", expirationTime);
        const userDetails = await getGoogleUserDetails(newToken.access_token);
        setIsLoggedIn(true);
        setUserDetails(userDetails);
      }
    };
    generateToken();
  }, [isLoggedIn]);
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID_KEY}>
        <Routes>
          <Route
            path="/"
            element={<Googlelogin isLoggedIn={isLoggedIn} login={login} />}
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userDetails={isLoggedIn ? userDetails : ""}
                handleLogout={handleLogout}
              />
            }
          />
        </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
