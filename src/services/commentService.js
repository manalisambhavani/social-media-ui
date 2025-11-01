import axiosInstance from '../api/axiosInstance';


export const commentService = {
    list: (postId, page, limit) => axiosInstance.get(`/post/${postId}/comment?page=${page}&limit=${limit}`),
    create: (data) => axiosInstance.post('/comment', data),
    update: (id, data) => axiosInstance.put(`/comment/${id}`, data),
    delete: (id) => axiosInstance.delete(`/comment/${id}`),
    get: (id) => axiosInstance.get(`/comment/${id}`),
};