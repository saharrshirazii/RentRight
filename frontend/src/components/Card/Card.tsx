import { ReactNode } from "react";

type CardProps = {
    title: string, 
    description: string,
    children? : ReactNode;
}; 

const Card = ({title, description, children}: CardProps) =>{
    return(
        <div style={{border: "1px solid black", padding: "10px", margin: "10px"}}>
            <h2>{title}</h2>
            <p>{description}</p>
            {children}
        </div>
    );
};

export default Card;