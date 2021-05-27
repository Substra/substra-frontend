import axios from 'axios';
import Cookies from 'universal-cookie';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 10000,
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
});

// TODO:
// proper request handling should be:
// 1. try call
// 2. if success, then success
// 3. if auth error, then refresh token, then try call again

API.interceptors.request.use((config) => {
    const cookies = new Cookies();
    const jwt = cookies.get('header.payload');
    return {
        ...config,
        withCredentials: true,
        headers: {
            Authorization: `JWT ${jwt}`,
        },
    };
});

export default API;
