import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Typography, CircularProgress, Box } from '@mui/material';
import { friendService } from '../../services/friendService';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await friendService.listUsers();

                // ✅ Handle if API returns { data: [...] } or raw array
                const data = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data)
                        ? res.data
                        : res?.data?.data || [];

                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSendRequest = async (id) => {
        try {
            await friendService.sendRequest(id);
            alert('Friend request sent!');
        } catch (err) {
            console.error('Error sending request:', err);
            alert('Failed to send friend request');
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!users.length) {
        return (
            <Typography variant="body2" color="textSecondary">
                No users found.
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant="h6" sx={{ mb: 2 }}>
                All Users
            </Typography>
            {users.map((u) => (
                <Card key={u.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle1">{u.username}</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSendRequest(u.id)}
                            sx={{ mt: 1 }}
                        >
                            Add Friend
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default UsersList;
