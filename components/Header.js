import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { listenToAuthChange } from "../utils/authStateChange";

export const Header = ({ session }) => {
  const auth = useAuth();

  useEffect(() => {
    listenToAuthChange();
  }, []);

  return (
    <div className="bg-slate-800 text-slate-100 py-8">
      <div className=" text-center  text-3xl">Grab App</div>
      {session ? (
        <button
          className="button rounded border-solid border-2 border-slate-100 p-2 text-xl absolute right-4 top-6"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      ) : null}
    </div>
  );
};
