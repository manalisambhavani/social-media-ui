import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Typography, TextField, Button, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfiniteScrollList from './InfiniteScrollList';
import { reactionService } from '../services/reactionService';
import { commentService } from '../services/commentService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
                                <Typography variant="subtitle2">{comment.user.username}</Typography>

                                {comment.editing ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            value={comment.editText || comment.message}
                                            onChange={(e) =>
                                                setComments((prev) =>
                                                    prev.map((c) =>
                                                        c.id === comment.id
                                                            ? { ...c, editText: e.target.value }
                                                            : c
                                                    )
                                                )
                                            }
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mt: 1, mr: 1 }}
                                            onClick={async () => {
                                                await commentService.update(comment.id, {
                                                    message: comment.editText,
                                                });
                                                const res = await commentService.get(comment.id);
                                                const updated = res.data.data;
                                                setComments((prev) =>
                                                    prev.map((c) =>
                                                        c.id === updated.id ? updated : c
                                                    )
                                                );
                                            }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() =>
                                                setComments((prev) =>
                                                    prev.map((c) =>
                                                        c.id === comment.id
                                                            ? { ...c, editing: false }
                                                            : c
                                                    )
                                                )
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2">{comment.message}</Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <IconButton
                                                    color={
                                                        comment.userReactionOnComment?.id ? 'error' : 'default'
                                                    }
                                                    onClick={() => toggleReaction(comment)}
                                                >
                                                    <FavoriteIcon />
                                                </IconButton>
                                                <Typography variant="caption">{comment.count}</Typography>
                                            </Box>
                                            
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        setComments((prev) =>
                                                            prev.map((c) =>
                                                                c.id === comment.id
                                                                    ? { ...c, editing: true }
                                                                    : c
                                                            )
                                                        )
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={async () => {
                                                        if (
                                                            window.confirm(
                                                                'Are you sure you want to delete this comment?'
                                                            )
                                                        ) {
                                                            await commentService.delete(comment.id);
                                                            setComments((prev) =>
                                                                prev.filter((c) => c.id !== comment.id)
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>                    
                    ))}
                </InfiniteScrollList>
            </CardContent>
        </Card>
    );
};

export default CommentList;
