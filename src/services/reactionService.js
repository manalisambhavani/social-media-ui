import axiosInstance from '../api/axiosInstance';


export const reactionService = {
    addPostReaction: (id, reactionName) => axiosInstance.post(`/reaction/${id}`, { reactionName }),
    deletePostReaction: (id) => axiosInstance.delete(`/reaction/${id}`),
    addCommentReaction: (id) => axiosInstance.post(`/comment-reaction/${id}`),
    deleteCommentReaction: (id) => axiosInstance.delete(`/comment-reaction/${id}`),
};