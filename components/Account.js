import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AddElementForm } from "./AddElementForm";
import { ElementCard } from "./ElementCard";

export const Account = ({ session }) => {
  const [userID, setUserID] = useState("");
  const [elements, setElements] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const user = supabase.auth.user();
    setUserID(user.id);
    getElements(user);
  }, [session]);

  const getElements = async (user) => {
    try {
      let { data, error, status } = await supabase
        .from("grab_db")
        .select("id,element,updated_at")
        .eq("userID", user.id);
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setElements(data);
        setLastUpdate(data[0].updated_at);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateTimeInDB = async (newTime) => {
    const { data, error } = await supabase
      .from("grab_db")
      .update({ updated_at: newTime })
      .match({ userID: userID });
  };

  const addElementInDB = async (newElement) => {
    let newUpdateTime = new Date().toLocaleString();
    try {
      const { data, error } = await supabase.from("grab_db").insert({
        userID: userID,
        element: newElement,
        updated_at: newUpdateTime,
      });
      UpdateTimeInDB(newUpdateTime);
      console.log(newUpdateTime);
    } catch (error) {
      console.log(error);
    } finally {
      setLastUpdate(newUpdateTime);
    }
  };

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = async (newAddedElement) => {
    setIsFormOpen(false);
    await addElementInDB(newAddedElement);
    getElements(supabase.auth.user());
  };

  const updateOnDashboard = (data) => {
    let temp = elements;
    temp.forEach((ele) => {
      if (ele.id === data.elementID) {
        ele.element.data = data.newValue;
      }
    });
    setElements((prevState) => [...temp]);
  };

  const invokeCloudFunction = async (data, updateTime) => {
    data.updated_at = updateTime;
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
    let currentTime = new Date().toLocaleString();
    const difference =
      new Date(currentTime).getTime() - new Date(lastUpdate).getTime();
    if (difference > 180000) {
      let temp = elements;
      temp.forEach((element) => {
        element.element.data = "loading";
      });
      let updateTime = new Date().toLocaleString();

      for (let i = 0; i < elements.length; i++) {
        invokeCloudFunction(elements[i], updateTime);
      }
      setElements((prev) => [...temp]);
      setLastUpdate((prevState) => updateTime);
    } else {
      alert("Not enough time has passed");
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
            {elements.length ? (
              elements.map((element, index) => (
                <ElementCard element={element} key={index} />
              ))
            ) : (
              <div>No elements grabbed yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
