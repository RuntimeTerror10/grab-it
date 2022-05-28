import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Header } from "../components/Header";
import { ElementsContainer } from "../components/ElementsContainer";
import { AddElementForm } from "../components/AddElementForm";

export default function Dashboard({ user }) {
  const [elements, setElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  console.log(elements);

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
        data.forEach((element) => {
          element.status = "loaded";
        });
        setElements(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const UpdateTimeInDB = async (newTime) => {
    const { data, error } = await supabase
      .from("grab_db")
      .update({ updated_at: newTime })
      .match({ userID: user.id });
  };

  const updateOnDashboard = (data) => {
    let temp = elements;
    temp.forEach((ele) => {
      if (ele.id === data.elementID) {
        ele.element.data = data.newValue;
        ele.status = "loaded";
      }
    });
    setElements((prevState) => [...temp]);
  };

  const invokeCloudFunction = async (newElement) => {
    const tempObj = { element: newElement, updateTime: new Date() };
    const options = {
      method: "POST",
      body: JSON.stringify(tempObj),
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
    let currentTime = new Date();
    let lastUpdateTime = new Date(elements[0].updated_at);
    let difference = currentTime - lastUpdateTime;

    console.log(difference);

    if (difference > 180000) {
      let temp = elements;
      temp.forEach((element) => {
        element.status = "loading";
      });
      setElements((prevState) => [...temp]);
      for (let i = 0; i < elements.length; i++) {
        invokeCloudFunction(elements[i]);
      }
    } else {
      console.log("fetch from DB");
    }
  };

  const addElementInDB = async (newElement) => {
    let newUpdateTime = new Date();
    try {
      const { error } = await supabase.from("grab_db").insert({
        userID: user.id,
        element: newElement,
        updated_at: newUpdateTime,
      });
      UpdateTimeInDB(newUpdateTime);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (newElement) => {
    setIsFormOpen(false);
    await addElementInDB(newElement);
    getElements(user);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getElements(user);
    // let i = 0;
    // setInterval(() => {
    //   console.log(++i);
    // }, 2000);
  }, []);

  return (
    <div>
      <Header session={user} />
      {user && (
        <div>
          <h1 className="text-center mt-10 text-2xl">
            Welcome to your Dashboard{" "}
            <strong>{user.user_metadata.full_name}</strong>!
          </h1>
          <div className="w-full flex justify-end mt-10">
            {!isLoading && (
              <>
                <button
                  onClick={handleRefresh}
                  className="bg-slate-800 text-slate-100 p-3 rounded mr-3"
                >
                  Refresh
                </button>
                <button
                  onClick={() => {
                    setIsFormOpen(true);
                  }}
                  className="bg-slate-800 text-slate-100 p-3 rounded mr-3"
                >
                  Add Item +
                </button>
              </>
            )}
          </div>
          {isFormOpen ? (
            <AddElementForm
              formSubmit={handleFormSubmit}
              formClose={handleFormClose}
            />
          ) : null}
          <div className="mt-10">
            {isLoading ? (
              <div className="text-center text-2xl ">
                Loading your elements...
              </div>
            ) : (
              <div className="w-full flex justify-evenly">
                {elements.length ? (
                  <ElementsContainer elements={elements} />
                ) : (
                  <div className="text-center text-2xl">
                    No elements grabbed yet!
                  </div>
                )}
              </div>
            )}
          </div>
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
