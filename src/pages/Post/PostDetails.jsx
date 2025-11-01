import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import CommentList from '../../components/CommentList';
import { postService } from '../../services/postService';
import { commentService } from '../../services/commentService';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchPost = async () => {
        try {
            const res = await postService.get(id);
            setPost(res.data.data);
        } catch (err) {
            console.error('Error fetching post:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            await commentService.create({ message: comment, postId: parseInt(id) });
            setComment('');
            fetchPost(); // refresh to show updated comment count
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                Post not found
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 3 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {post.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {post.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Posted by {post.user?.username}
                    </Typography>
                </CardContent>
            </Card>

            <Divider sx={{ my: 2 }} />

            <CommentList postId={id} />
        </Box>
    );
};

export default PostDetailPage;
