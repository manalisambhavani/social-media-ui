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
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {post.description}
                </Typography>

                <Divider sx={{ mb: 1 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.keys(reactionIcons).map((name) => {
                        const count = post.count?.find((c) => c.reactionName === name)?.count || 0;
                        const isUserReacted = post.UserReaction?.ReactionName === name;
                        return (
                            <Tooltip title={name} key={name}>
                                <IconButton
                                    size="small"
                                    color={isUserReacted ? 'primary' : 'default'}
                                    onClick={() => toggleReaction(name)}
                                    disabled={updating}
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
                    <Typography variant="caption">
                        Total Reactions: {post.count?.reduce((sum, c) => sum + c.count, 0) || 0}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;
