import { supabase } from "./supabaseClient";

export const updateCookie = () => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      fetch("/api/auth", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json());
    }
  );

  return () => {
    authListener.unsubscribe();
  };
};
