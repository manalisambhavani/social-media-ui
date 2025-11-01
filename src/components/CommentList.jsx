import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Typography, TextField, Button, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfiniteScrollList from './InfiniteScrollList';
import { reactionService } from '../services/reactionService';
import { commentService } from '../services/commentService';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [reloading, setReloading] = useState(false); // 👈 new flag to block infinite scroll during manual refresh

    const fetchComments = useCallback(async (reset = false) => {
        if (loading || reloading) return;

        if (reset) setReloading(true);
        else setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            const res = await commentService.list(postId, currentPage, 10);
            const { data = [], pagination = {} } = res.data;

            setComments((prev) => {
                const merged = reset ? data : [...prev, ...data];
                const unique = Array.from(new Map(merged.map((c) => [c.id, c])).values());
                return unique;
            });
            setHasNext(pagination.hasNextPage);

            if (reset) setPage(1); // keep consistent after reload
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            if (reset) setReloading(false);
            else setLoading(false);
        }
    }, [page, postId, loading, reloading]);

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await commentService.create({ message: newComment, postId });
            setNewComment('');
            await fetchComments(true); // 👈 full refresh, controlled
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const toggleReaction = async (comment) => {
        try {
            if (comment.userReactionOnComment?.id) {
                await reactionService.deleteCommentReaction(comment.userReactionOnComment.id);
            } else {
                await reactionService.addCommentReaction(comment.id);
            }
            // refresh only this comment
            const res = await commentService.get(comment.id);
            const updated = res.data.data;
            setComments((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            );
        } catch (err) {
            console.error('Error toggling comment reaction:', err);
        }
    };

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6">Comments</Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || loading || reloading}
                    >
                        Add
                    </Button>
                </Box>

                <InfiniteScrollList
                    loadMore={() => !reloading && setPage((p) => p + 1)} // 👈 block during reload
                    hasMore={!reloading && hasNext}
                    loading={loading || reloading}
                >
                    {comments.map((comment) => (
                        <Card key={comment.id} variant="outlined" sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2">
                                    {comment.user?.username || 'Anonymous'}
                                </Typography>
                                <Typography variant="body2">{comment.message}</Typography>
                                <IconButton
                                    color={comment.userReactionOnComment?.id ? 'error' : 'default'}
                                    onClick={() => toggleReaction(comment)}
                                >
                                    <FavoriteIcon />
                                </IconButton>
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                    {comment.count || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </InfiniteScrollList>
            </CardContent>
        </Card>
    );
};

export default CommentList;
