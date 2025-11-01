import axiosInstance from '../api/axiosInstance';


export const authService = {
    signup: (data) => axiosInstance.post('/signup', data),
    login: (data) => axiosInstance.post('/login', data),
    getProfile: () => axiosInstance.get('/profile'),
};