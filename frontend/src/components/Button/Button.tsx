import { ReactNode } from "react";

type ButtonProps = {
    onClick: () => void,
    children ?: ReactNode;

};

const Button = ({ children, onClick} : ButtonProps) => {
    return(
        <button onClick={onClick}  style={{padding: "8px 16px"}}>
            {children}
        </button>
    );
};

export default Button;