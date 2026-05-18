// import axios from 'axios';
import { Property } from '../types/property';

const API_URL = 'http://localhost:3000/api/v1/properties';

interface PropertiesResponse {
    status: string;
    results: number;
    pagination: {
        totalProperties: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    data: Property[];
}

// export const getProperties= async (
//   page: number,
//   category: string
// ) => {
//   const url = `${API_URL}?page=${page}${
//     category ? `&category=${category}` : ''
//   }`;

//   return await axios.get<PropertiesResponse>(url);
// };


export const getProperties = async (
    page: number,
    category: string,
    price: string,
): Promise<PropertiesResponse> => {
   
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (category) {
        params.append('category', category);
    }
    if (price) {
        params.append('price', price);
    }

    const url = `${API_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }

    return await response.json();
};