import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Googlelogin = ({ isLoggedIn, login }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      login(tokenResponse);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
    //scope: "profile email openid",
    flow: "auth-code",
  });
  return (
    <div>
      {!isLoggedIn ? (
        <>
          <h1>Sign in with Google</h1>
          <button
            style={{
              background: "blue",
              color: "white",
              padding: "15px 32px",
              cursor: "pointer",
            }}
            onClick={() => googleLogin()}
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <p>You are already logged in.</p>
      )}
    </div>
  );
};
export default Googlelogin;
