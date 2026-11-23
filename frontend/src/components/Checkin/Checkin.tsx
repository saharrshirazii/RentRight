import React from "react";
import { Calendar } from 'primereact/calendar';
import "./Checkin.css";

interface CheckinProps {
    label?: string;
    value: string; // This is a string like "2026-05-19" for HeroSearchBar
    type?: string;
    onChange?: (dateStr: string) => void;
    className?: string;
}

export default function Checkin({ label, value, type, onChange, className }: CheckinProps) {
    
    // PrimeReact Calendar expects a native JS Date object, so we convert the incoming string.
    // If there's no value yet, we keep it null so it shows the placeholder.
    const calendarValue = value ? new Date(value.replace(/\//g, '-')) : null;

     //today's timestamp 
        const today = new Date();
        today.setHours(0,0,0,0);


    const handleDateChange = (e: any) => {
        const selectedDate = e.value as Date | null;
        
        if (selectedDate) {
            // Convert native Date to a clean string format: YYYY-MM-DD
            // Using Sweden's local timezone format matching your laptop calendar setup
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDateString = `${year}/${month}/${day}`;
            if(onChange){
            onChange(formattedDateString);
            } // Pass it straight to HeroSearchBar state
        } else {if(onChange){
            onChange(''); // Clears out the filter if they delete the selection
        }
    }
    };

    return (
        <div className="card flex flex-wrap gap-3 p-fluid">
            <div className="flex-auto">
                <label htmlFor={label} className="font-bold block mb-2 text-gray-700 text-sm">
                    {label}
                </label>
                <Calendar
                    className="w-full bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-gray-50 focus-within:border-indigo-500 transition-colors text-sm py-2 px-2"
                    panelClassName="custom-calendar-panel"
                    id={label} // Given unique IDs so check-in and check-out don't conflict
                    value={calendarValue}
                    placeholder="Välj datum"
                    onChange={handleDateChange}
                    minDate={today} //disable all past dates
                    dateFormat="yy/mm/dd"
                    showIcon
                />
            </div>
        </div>
    );
}
