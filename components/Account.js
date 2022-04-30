import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AddElementForm } from "./AddElementForm";

export const Account = ({ session }) => {
  const [userPlan, setUserPlan] = useState("");
  const [elements, setElements] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("grab_db")
        .select(`plan,elements,updated_at`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserPlan(data.plan);
        setElements(data.elements);
        setLastUpdated(data.updated_at);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      // }
      console.log(userPlan);
    }
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

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="w-screen">
      <div className="w-full flex justify-end ">
        <button
          onClick={handleFormOpen}
          className="bg-slate-800 text-slate-100 p-3 rounded mr-3"
        >
          + Add New Item to Track
        </button>
      </div>
      {isFormOpen ? <AddElementForm /> : null}

      <div>
        {loading ? (
          <div>loading...</div>
        ) : (
          <div>
            {elements.length ? (
              <div>Hello</div>
            ) : (
              <div>No Elements Grabbed yet!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
