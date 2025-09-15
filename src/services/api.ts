import axios from 'axios';

const api = axios.create({
	baseURL: '/api',
});

// Set up request interceptor to add auth token
api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Set up response interceptor to handle auth errors
api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Clear stored auth data and redirect to login
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/';
		}
		return Promise.reject(error);
	}
);

export default api;
