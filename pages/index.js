import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import Link from "next/link";
import { Header } from "../components/Header";

export default function Home() {
  const auth = useAuth();

  return (
    <div>
      <Header session={auth.session} />
      <div className="text-center text-xl mt-4">Grab from Anywhere!</div>
      <div className="flex justify-center mt-10">
        {auth.session ? (
          <Link href="/dashboard">
            <a className="py-3 px-5 bg-slate-800 text-slate-100 text-xl rounded">
              Go to dashboard
            </a>
          </Link>
        ) : (
          <Link href="/login">
            <a className="py-3 px-5 bg-slate-800 text-slate-100 text-xl rounded ">
              Login
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
