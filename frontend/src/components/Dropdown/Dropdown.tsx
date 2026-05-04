import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";
import "./Dropdown.css";


type DropdownOption = {
    value: string | number;
    label: string;
    icon?: string;
};

interface DropdownProps {
    label: string;
    options: DropdownOption[];
    placeholder?: string;
    onSelect: (option: DropdownOption) => void;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect, disabled }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    //Close when clicking outside
    useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutSide);

        return () => document.removeEventListener('mousedown', handleClickOutSide);
    }, []);


    return (
        <div className={`dropdown-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
            {/* Trigger Bottun */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="dropdown-trigger"
                disabled={disabled}
            >
                {label}
                {/* <IoIosArrowDropdown/> */}
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Menu Options */}
            {isOpen && (
                <div className="dropdown-menu">
                    <div className='py-1'>
                        {options.map((option) => (
                            <button key={option.value}
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className="dropdown-item">
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}


        </div>

    )
}

export default Dropdown