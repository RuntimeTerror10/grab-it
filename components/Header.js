import { supabase } from "../utils/supabaseClient";

export const Header = ({ session }) => {
  return (
    <div className="bg-slate-800 text-slate-100 py-8">
      <div className=" text-center  text-2xl">Grab App</div>
      {session ? (
        <button
          className="button rounded border-solid border-2 border-slate-100 p-2 text-xl absolute right-4 top-6"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      ) : null}
    </div>
  );
};
