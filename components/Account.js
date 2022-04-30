import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const Account = ({ session }) => {
  //   const [loading, setLoading] = useState(true);
  //   const [username, setUsername] = useState(null);
  //   const [website, setWebsite] = useState(null);
  //   const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    // try {
    //   setLoading(true);
    //   const user = supabase.auth.user();

    //   let { data, error, status } = await supabase
    //     .from("profiles")
    //     .select(`username, website, avatar_url`)
    //     .eq("id", user.id)
    //     .single();

    //   if (error && status !== 406) {
    //     throw error;
    //   }

    //   if (data) {
    //     setUsername(data.username);
    //     setWebsite(data.website);
    //     setAvatarUrl(data.avatar_url);
    //   }
    // } catch (error) {
    //   alert(error.message);
    // } finally {
    //   setLoading(false);
    // }
    console.log("get profile");
  }

  //   async function updateProfile({ username, website, avatar_url }) {
  //     try {
  //       setLoading(true);
  //       const user = supabase.auth.user();

  //       const updates = {
  //         id: user.id,
  //         username,
  //         website,
  //         avatar_url,
  //         updated_at: new Date(),
  //       };

  //       let { error } = await supabase.from("profiles").upsert(updates, {
  //         returning: "minimal", // Don't return the value after inserting
  //       });

  //       if (error) {
  //         throw error;
  //       }
  //     } catch (error) {
  //       alert(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  return (
    <div>
      <div className="text-3xl">Successfully Signed In</div>
      <button className="button block" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  );
};
