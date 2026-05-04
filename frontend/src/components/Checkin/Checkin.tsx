
import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import "./Checkin.css";


interface CheckinProps {
    label: string;
}

export default function Checkin({label} : CheckinProps) {
    const [date, setDate] = useState<Nullable<Date>>(null);

    return (
        <div className="card flex flex-wrap gap-3 p-fluid">
            <div className="flex-auto">
                <label htmlFor="buttondisplay" className="font-bold block mb-2 text-gray-700 text-sm">
                    {label}
                </label>
                <Calendar
                className="w-full bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-gray-50 focus-within:border-indigo-500 transition-colors text-sm py-2 px-2"
                panelClassName="custom-calendar-panel"
                id="buttondisplay"
                value={date}
                placeholder="Välj datum"
                onChange={(e) => setDate(e.value)}
                showIcon
                />
            </div>

        </div>
    )
}
