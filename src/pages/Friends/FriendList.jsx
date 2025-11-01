import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { getFriends } from '../../services/friendService';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        getFriends().then(setFriends);
    }, []);

    return (
        <div>
            <Typography variant="h5" sx={{ mb: 2 }}>My Friends</Typography>
            {friends.map((f) => (
                <Card key={f.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography>{f.username}</Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default FriendsList;
