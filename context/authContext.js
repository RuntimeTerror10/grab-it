import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../utils/supabaseClient";
import Router from "next/router";

// import { supabase } from "../utils/supabaseClient.js";

export const AuthContext = createContext();

export function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const activeSession = supabase.auth.session();
    setSession(activeSession);
    setUser(activeSession?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const sharedState = {
    session: session,
    user: user,
    msg: "hello",
    signIn: () => {
      supabase.auth.signIn(
        {
          provider: "google",
        },
        {
          redirectTo: "https://grab-it-snowy.vercel.app/dashboard",
        }
      );
    },
    signOut: () => {
      supabase.auth.signOut();
      Router.push("/login");
    },
  };

  return (
    <AuthContext.Provider value={sharedState}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
