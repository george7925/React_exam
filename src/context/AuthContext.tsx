import { createContext, useContext, useState, ReactNode } from "react";
import { AuthUser } from "../types/user";

interface AuthContextValue {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>({
    username: "",
    isLoggedIn: false,
  });

  const login = (username: string) => {
    setUser({
      username: username.trim(),
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser({
      username: "",
      isLoggedIn: false,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
