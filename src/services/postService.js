import axiosInstance from '../api/axiosInstance';


export const postService = {
    list: (page, limit) => axiosInstance.get(`/post?limit=${limit}&page=${page}`),
    create: (data) => axiosInstance.post('/post', data),
    update: (id, data) => axiosInstance.put(`/post/${id}`, data),
    delete: (id) => axiosInstance.delete(`/post/${id}`),
    get: (id) => axiosInstance.get(`/post/${id}`),
};