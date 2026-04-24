import React from 'react'
import './Input.css';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string;
    value: string;
    placeholder?: string;
    type: string;
    error?: string;
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}


const Input: React.FC<InputProps> = ({
    label, error, value, onChange, placeholder, type = 'text', ...rest }) => {
    return (
        <div className="input-container ">
            <label className="input-label">{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={`input-field ${error ? 'input-error-border' : ''}`}                
                {...rest} />
            {error && (<span className="input-error-text">{error}</span>)}
        </div>
    );
};

export default Input;


