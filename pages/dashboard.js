import { supabase } from "../utils/supabaseClient";
import { Header } from "../components/Header";

export default function Dashboard({ user }) {
  console.log(user);
  return (
    <div>
      <Header session={user} />
      {user && (
        <div>
          <h1 className="text-center mt-10 text-2xl">
            This is your Dashboard{" "}
            <strong>{user.user_metadata.full_name}</strong>
          </h1>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { user } };
}
