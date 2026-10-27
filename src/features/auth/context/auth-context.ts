import { createContext } from "react";

export type AuthUser = {
  userId: number | string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  roleId: number | string | null;
  role: "admin" | "admission" | "doctor" | null;
};

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  renewAt: number | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  renewSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
