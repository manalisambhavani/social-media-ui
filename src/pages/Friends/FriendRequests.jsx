import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { getFriendRequests, updateFriendRequest } from '../../services/friendService';

const FriendRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getFriendRequests().then(setRequests);
    }, []);

    const handleAction = async (id, status) => {
        await updateFriendRequest(id, status);
        setRequests((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div>
            <Typography variant="h5" sx={{ mb: 2 }}>Friend Requests</Typography>
            {requests.map((r) => (
                <Card key={r.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography>{r.username}</Typography>
                        <Button color="success" onClick={() => handleAction(r.id, 'accepted')}>Accept</Button>
                        <Button color="error" onClick={() => handleAction(r.id, 'declined')}>Decline</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default FriendRequests;
