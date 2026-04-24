type ButtonProps = {
    label: string
};

const Button = ({label} : ButtonProps) => {
    return(
        <button style={{padding: "8px 16px"}}>
            {label}
        </button>
    );
};

export default Button;