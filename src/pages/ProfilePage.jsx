import React, { useEffect, useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { friendService } from '../services/friendService';
import UsersList from './Friends/UserList';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [actionLoading, setActionLoading] = useState({}); // track loading per request
    const navigate = useNavigate();

    const fetchProfileData = async () => {
        try {
            const [profileRes, friendsRes, requestsRes] = await Promise.all([
                authService.getProfile(),
                friendService.listFriends(),
                friendService.listRequests(),
            ]);

            const profileData = profileRes?.data?.data || null;
            const friendsData = Array.isArray(friendsRes?.data)
                ? friendsRes.data
                : friendsRes?.data?.data || [];
            const requestsData = Array.isArray(requestsRes?.data)
                ? requestsRes.data
                : requestsRes?.data?.data || [];

            setProfile(profileData);
            setFriends(friendsData);
            setFriendRequests(requestsData);
        } catch (err) {
            console.error('Error fetching profile data:', err);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleUpdateRequest = async (id, status) => {
        try {
            setActionLoading((prev) => ({ ...prev, [id]: true }));
            await friendService.updateRequest(id, status);
            // After updating, refresh requests and friends
            const [friendsRes, requestsRes] = await Promise.all([
                friendService.listFriends(),
                friendService.listRequests(),
            ]);
            setFriends(friendsRes?.data?.data || friendsRes?.data || []);
            setFriendRequests(requestsRes?.data?.data || requestsRes?.data || []);
        } catch (err) {
            console.error(`Failed to ${status} request:`, err);
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h6" color="error">
                    Unable to load profile. Please log in again.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
                    Go to Login
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            {/* Profile Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: 'primary.main',
                            fontSize: 40,
                        }}
                    >
                        {profile.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h5">{profile.username}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {profile.email}
                    </Typography>
                </CardContent>
            </Card>

            {/* Friends List */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Friends ({friends.length})
                    </Typography>
                    {friends.length ? (
                        friends.map((f) => (
                            <Typography key={f.id} variant="body2">
                                • {f.username}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            You have no friends yet.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Pending Friend Requests */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Pending Friend Requests ({friendRequests.length})
                    </Typography>
                    {friendRequests.length ? (
                        friendRequests.map((r) => (
                            <Box
                                key={r.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                }}
                            >
                                <Typography variant="body2">
                                    • {r.sender?.username || r.username}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        disabled={actionLoading[r.id]}
                                        onClick={() => handleUpdateRequest(r.id, 'accepted')}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        disabled={actionLoading[r.id]}
                                        onClick={() => handleUpdateRequest(r.id, 'declined')}
                                    >
                                        Reject
                                    </Button>
                                </Stack>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No pending requests.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Explore Users */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Explore Users
                    </Typography>
                    <UsersList />
                </CardContent>
            </Card>

            <Divider sx={{ my: 2 }} />

            {/* Logout */}
            <Box textAlign="center">
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default ProfilePage;
