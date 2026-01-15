import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api', // Backend runs on port 8000
    timeout: 10000,
});

// Add error handler
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

export default instance;