import { useEffect } from "react";
import Router from "next/router";
import { listenToAuthChange } from "../utils/authStateChange";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/authContext";
import { Auth } from "../components/Auth";
import { Header } from "../components/Header";

export default function Login({ user }) {
  const auth = useAuth();

  useEffect(() => {
    if (auth.session) {
      Router.push("/dashboard");
    }
    listenToAuthChange();
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

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: { user } };
}
