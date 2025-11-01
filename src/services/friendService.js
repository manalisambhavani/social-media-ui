import axiosInstance from '../api/axiosInstance';


export const friendService = {
    listUsers: () => axiosInstance.get('/list-users'),
    getUser: (id) => axiosInstance.get(`/user/${id}`),
    sendRequest: (id) => axiosInstance.post(`/send-friend-request/${id}`),
    listRequests: () => axiosInstance.get('/friend-request'),
    updateRequest: (id, status) => axiosInstance.patch(`/friend-request/${id}`, { status }),
    listFriends: () => axiosInstance.get('/friends'),
};