import React, { createContext, useContext, useState } from "react";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login({ email, password }) {
    // mock login
    setUser({ name: email.split("@")[0] || "Usuário", email });
    return Promise.resolve();
  }

  function logout() {
    setUser(null);
  }

  function register({ name, email, password }) {
    setUser({ name, email });
    return Promise.resolve();
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(){ return useContext(AuthCtx); }
