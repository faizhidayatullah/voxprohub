import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return <AuthCtx.Provider value={{ token, user, login, logout }}>{children}</AuthCtx.Provider>;
}

// ⬇️ Pastikan ini fungsi (hook), bukan objek/const non-fungsi
export const useAuth = () => useContext(AuthCtx);
