import { ReactNode } from "react";

type CardProps = {
  children?: ReactNode;
};

const Card = ({ children }: CardProps) => {
  return (
    <>
      {children}
    </>
  );
};

export default Card;