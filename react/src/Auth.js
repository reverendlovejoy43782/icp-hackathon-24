import { createContext, useEffect, useState} from "react";
import { authSubscribe } from "@junobuild/core";
import { Login } from "./Login";
import { Logout } from "./Logout";
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

// Hash function using SHA-256
export const hashUserId = (userId) => {
  // Create a SHA-256 hash of the user key
  return CryptoJS.SHA256(userId).toString();
};
console.log("hashUserId", hashUserId);

export const Auth = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // TODO: STEP_4_AUTH_SUBSCRIBE
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);
  console.log("user", user);
  return (
    <AuthContext.Provider value={{ user }}>
      {user !== undefined && user !== null ? (
        <div>
          {children}

          <Logout />
        </div>
      ) : (
        <Login />
      )}
    </AuthContext.Provider>
  );
};
