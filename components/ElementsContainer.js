import { ElementCard } from "./ElementCard";

export const ElementsContainer = (props) => {
  return (
    <>
      {props.elements.map((item, index) => (
        <ElementCard item={item} key={index} />
      ))}
    </>
  );
};
