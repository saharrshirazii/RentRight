import React from 'react'
import { useParams, Params } from 'react-router-dom'

//type for our URL parameters
interface PropertyParams {
    id: string;
};

export const PropertyDetail: React.FC = () => {
    const { id } = useParams<Params & { id: string }>();
    return (
        <div>
            <h1><h1>Visar boende med ID: {id}</h1></h1>
        </div>
    )
}

