import { ReactNode } from "react";

type ButtonProps = {
    onClick: () => void,
    children ?: ReactNode;
    className?: string;
};

const Button = ({ children, onClick, className} : ButtonProps) => {
    return(
        <button onClick={onClick}  style={{padding: "8px 16px"}} className={className}>
            {children}
        </button>
    );
};

export default Button;