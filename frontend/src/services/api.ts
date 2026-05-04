import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
});

export const gettUsers = async() => {
    const response = await api.get('/users');
    return response.data;
}