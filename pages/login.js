import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import Router from "next/router";
import { Header } from "../components/Header";
import { Auth } from "../components/Auth";

export default function Login() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.session) {
      Router.push("/dashboard");
    }
  });
  return (
    <>
      <div>
        <Header session={auth.session} />
        <div>
          <h1 className="text-2xl text-center my-5 font-bold">Login</h1>
          {/* <button onClick={handleGoogleSignIn}>Sign In with Google</button> */}
          <Auth authSession={auth} />
        </div>
      </div>
    </>
  );
}
