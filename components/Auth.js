import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-screen">
      <div className="text-center text-xl mt-4">Grab from Anywhere!</div>
      <div className="w-ful flex justify-center mt-4">
        <div className="bg-slate-800 w-3/5 rounded py-4 flex flex-col items-center">
          <form
            className="flex flex-col justify-center items-center "
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
          >
            <input
              className="p-3 border-2 border-slate-100 rounded"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="p-3 bg-slate-100 text-slate-800 border-2 border-slate-800 rounded mt-4"
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Send magic link"}</span>
            </button>
          </form>
          <div
            className="relative bg-slate-400 w-4/5 my-4"
            style={{ height: "1px" }}
          ></div>
          <button
            onClick={handleGoogleSignIn}
            className="p-3 bg-slate-100 text-slate-800 border-2 border-slate-800 rounded mt-4"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};
