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
        .select("id,element")
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

  const addElementInDB = async (newElement) => {
    let newUpdateTime = new Date().toLocaleString();
    try {
      const { data, error } = await supabase.from("grab_db").insert({
        userID: user.id,
        element: newElement,
        updated_at: newUpdateTime,
      });
      // UpdateTimeInDB(newUpdateTime);
      // console.log(newUpdateTime);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (newElement) => {
    setIsFormOpen(false);
    await addElementInDB(newElement);
    getElements(user);
    // setElements([...elements, newElement]);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getElements(user);
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
                <button className="bg-slate-800 text-slate-100 p-3 rounded mr-3">
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
