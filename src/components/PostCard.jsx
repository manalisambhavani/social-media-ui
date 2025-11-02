import React, { useState, useCallback } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    IconButton,
    Box,
    Avatar,
    Tooltip,
    Divider,
    TextField,
    Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';
import { reactionService } from '../services/reactionService';
import { postService } from '../services/postService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const reactionIcons = {
    like: <ThumbUpIcon color="primary" />,
    love: <FavoriteIcon color="error" />,
    happy: <EmojiEmotionsIcon color="warning" />,
    celebrate: <CelebrationIcon color="success" />,
    insightful: <EmojiObjectsIcon color="info" />,
    funny: <SentimentSatisfiedAltIcon color="secondary" />,
};

const PostCard = ({ post, onUpdated }) => {
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editDescription, setEditDescription] = useState(post.description);

    const toggleReaction = useCallback(
        async (reactionName) => {
            if (updating) return;
            setUpdating(true);

            try {
                if (post.userReaction?.id && post.userReaction.reactionName === reactionName) {
                    // remove reaction
                    await reactionService.deletePostReaction(post.userReaction.id);
                } else {
                    // add reaction
                    await reactionService.addPostReaction(post.id, reactionName);
                }
                // refresh just this post
                const res = await postService.get(post.id);
                onUpdated?.(res.data.data);
            } finally {
                setUpdating(false);
            }
        },
        [post, updating, onUpdated]
    );

    return (
        <Card sx={{ mb: 3 }}>
            <CardHeader
                avatar={<Avatar>{post.user?.username[0].toUpperCase()}</Avatar>}
                title={post.user?.username}
                subheader={`Post #${post.id}`}
            />
            <CardContent>
                {editing ? (
                    <>
                        <TextField
                            fullWidth
                            label="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            multiline
                            rows={3}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={async () => {
                                await postService.update(post.id, {
                                    title: editTitle,
                                    description: editDescription,
                                });
                                const res = await postService.get(post.id);
                                onUpdated?.(res.data.data);
                                setEditing(false);
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() => {
                                setEditing(false);
                                setEditTitle(post.title);
                                setEditDescription(post.description);
                            }}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">{post.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {post.description}
                        </Typography>
                    </>
                )}

                <Divider sx={{ mb: 1 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.keys(reactionIcons).map((name) => {
                        const count = post.count?.find((c) => c.reactionName === name)?.count || 0;
                        const isUserReacted = post.userReaction?.reactionName === name;
                        const icon = React.cloneElement(reactionIcons[name], {
                            // color: isUserReacted ? 'primary' : 'default',
                        });
                        return (
                            <Tooltip title={name} key={name}>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleReaction(name)}
                                    disabled={updating}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: isUserReacted ? 'primary.main' : 'grey.300',
                                        borderRadius: '20px',
                                        px: 1,
                                        color: isUserReacted ? 'primary.main' : 'text.secondary',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    {reactionIcons[name]}
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        {count}
                                    </Typography>
                                </IconButton>
                            </Tooltip>
                        );
                    })}
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => navigate(`/posts/${post.id}`)}>
                        <CommentIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => setEditing(true)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this post?')) {
                                    await postService.delete(post.id);
                                    onUpdated?.(null); // null means remove from list
                                }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="caption">
                            Total Reactions: {post.count?.reduce((sum, c) => sum + c.count, 0) || 0}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;
