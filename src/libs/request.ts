import axios from 'axios';

export default axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 10000,
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
});
