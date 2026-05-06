"use client";

import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/auth.service";
import { getStoredSession } from "@/lib/utils";

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, user: action.payload?.user || null, token: action.payload?.token || null, loading: false };
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: "INIT", payload: getStoredSession() });
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const session = await authService.login(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: session });
      return session;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      isAuthenticated: Boolean(state.token && state.user),
      role: state.user?.role || null
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
