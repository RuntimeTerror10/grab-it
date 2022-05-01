import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AddElementForm } from "./AddElementForm";
import { ElementCard } from "./ElementCard";

export const Account = ({ session }) => {
  const [elements, setElements] = useState([]);
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
        .select(`elements,updated_at`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setElements(data.elements);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      // }
    }
  }

  async function updateProfile(newData) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        elements: [...elements, newData],
        updated_at: new Date().toISOString().toLocaleString("en-US"),
      };

      let { error } = await supabase.from("grab_db").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = async (newAddedItem) => {
    setIsFormOpen(false);
    setLoading(true);
    await updateProfile(newAddedItem);
    getProfile();
  };
  console.log(elements);
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
      {isFormOpen ? <AddElementForm closeForm={handleFormClose} /> : null}

      <div className="w-full">
        {loading ? (
          <div>loading...</div>
        ) : (
          <div>
            {elements.length ? (
              <div className="w-full flex justify-evenly">
                {elements.map((element, index) => (
                  <ElementCard key={index} element={element} />
                ))}
              </div>
            ) : (
              <div>No Elements Grabbed yet!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
