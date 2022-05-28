export const ElementCard = (props) => {
  return (
    <div className="bg-slate-800 text-slate-100 p-4 text-xl flex flex-col items-center rounded">
      <div>{props.item.element.label}</div>
      <div className="mt-3">
        {props.item.status === "loading"
          ? "loading..."
          : `${props.item.element.data}`}
      </div>
    </div>
  );
};
