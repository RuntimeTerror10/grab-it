import { useState } from "react";

export const AddElementForm = (props) => {
  const [grabbedElement, setGrabbedElement] = useState("");
  const [itemLabel, setItemLabel] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();
    let elementJSON = JSON.parse(grabbedElement);
    elementJSON.label = itemLabel;
    props.closeForm(elementJSON);
  };

  return (
    <>
      <form
        className="w-screen bg-slate-800 flex justify-evenly py-10 mt-3"
        onSubmit={handleAddItem}
      >
        <div>
          <label htmlFor="grabbed_element" className="text-slate-100 mr-1">
            Grabbed element :
          </label>
          <input
            type="text"
            id="grabbed_element"
            name="grabbed_element"
            placeholder="Copy grabbed element here"
            className="bg-slate-100 border-solid border-2 border-slate-100 p-2"
            style={{ minWidth: "250px" }}
            value={grabbedElement}
            onChange={(e) => setGrabbedElement(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="add_label" className="text-slate-100 mr-1">
            Add label for element :
          </label>
          <input
            type="text"
            id="add_label"
            name="add_label"
            placeholder="add label (ex: my follower count)"
            className="bg-slate-100 border-solid border-2 border-slate-100 p-2"
            style={{ minWidth: "250px" }}
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="text-slate-100 rounded border-solid border-2 border-slate-100 p-3"
        >
          + Add Item
        </button>
      </form>
    </>
  );
};
