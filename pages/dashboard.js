import { useAuth } from "../context/authContext";
import Router from "next/router";
import { useEffect } from "react";
import { Header } from "../components/Header";

export default function Dashboard() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.session) Router.push("/login");
  }, [auth.session]);

  return (
    <div>
      <Header session={auth.session} />
      {auth.session && (
        <div>
          <h1 className="text-center mt-10 text-2xl">
            This is your Dashboard{" "}
            <strong>{auth.user.user_metadata.full_name}</strong>
          </h1>
        </div>
      )}
    </div>
  );
}
