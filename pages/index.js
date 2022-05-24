import styles from "../styles/Home.module.css";
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

// import { useState, useEffect } from "react";
// import { supabase } from "../utils/supabaseClient";
// import { Header } from "../components/Header";
// import { Auth } from "../components/Auth";
// import { Account } from "../components/Account";

// export default function Home() {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     setSession(supabase.auth.session());

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <div>
//       <Header session={session} />
//       <div className="container" style={{ padding: "50px 0 100px 0" }}>
//         {!session ? (
//           <Auth />
//         ) : (
//           <Account key={session.user.id} session={session} />
//         )}
//       </div>
//     </div>
//   );
// }
