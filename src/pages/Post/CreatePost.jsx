import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await postService.create({ title, description });
            navigate('/'); // navigate back to post list
        } catch (err) {
            console.error('Error creating post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Create New Post
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Posting...' : 'Create Post'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreatePostPage;
