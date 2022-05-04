import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AddElementForm } from "./AddElementForm";
import { ElementCard } from "./ElementCard";

export const Account = ({ session }) => {
  const [userID, setUserID] = useState("");
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("grab_db")
        .select(`id,elements`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserID(data.id);
        setElements(data.elements);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      // }
    }
  };

  const updateProfile = async (newData) => {
    try {
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
    }
  };

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = async (newAddedItem) => {
    setIsFormOpen(false);
    newAddedItem.elementID = elements.length;
    await updateProfile(newAddedItem);
    getProfile();
  };

  const updateOnDashboard = (data) => {
    let temp = elements;
    temp.forEach((ele) => {
      if (ele.elementID === data.eID) {
        ele.data = data.newValue;
      }
    });
    setElements((prevState) => [...temp]);
  };

  const invokeCloudFunction = async (data) => {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
    };
    fetch(
      "http://localhost:5000/grab-app-production/us-central1/helloWorld",
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        updateOnDashboard(data);
      });
  };

  const handleRefresh = () => {
    let temp = elements;
    temp.forEach((element) => {
      element.data = "loading";
    });
    let update_time = new Date().toISOString().toLocaleString("en-US");
    setElements((prev) => [...temp]);

    for (let i = 0; i < temp.length; i++) {
      let tempObj = {
        id: userID,
        element: temp[i],
        allElements: temp,
        updated_at: update_time,
      };
      invokeCloudFunction(tempObj);
      //   // let temp = elements;
      //   // temp[i].data = data;
      //   // setElements(temp);
      // }
    }
  };

  return (
    <div className="w-screen">
      <div className="w-full flex justify-end ">
        {elements.length > 0 && (
          <button
            onClick={handleRefresh}
            className="bg-slate-800 text-slate-100 p-3 rounded mr-3"
          >
            Refresh
          </button>
        )}
        <button
          onClick={handleFormOpen}
          className="bg-slate-800 text-slate-100 p-3 rounded mr-3"
        >
          + Add New Item to Track
        </button>
      </div>
      {isFormOpen ? <AddElementForm closeForm={handleFormClose} /> : null}

      <div className="w-full">
        <div>
          <div className="w-full flex justify-evenly mt-3">
            {elements.map((element, index) => (
              <ElementCard element={element} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
