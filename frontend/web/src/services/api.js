import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:49422/api'
});

export default api;