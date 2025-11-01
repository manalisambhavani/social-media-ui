import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { reactionService } from '../../services/reactionService';

const CommentItem = React.forwardRef(({ comment }, ref) => {
    const { id, message, user, count, UserReactionOnComment } = comment;
    const reacted = !!UserReactionOnComment;

    const handleToggleReaction = async () => {
        try {
            if (reacted) {
                await reactionService.deleteCommentReaction(UserReactionOnComment.id);
            } else {
                await reactionService.addCommentReaction(id);
            }
        } catch (err) {
            console.error('Error toggling reaction:', err);
        }
    };

    return (
        <Card ref={ref} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body1">{message}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            — {user?.username}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleToggleReaction}>
                            {reacted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Typography variant="body2" color="textSecondary">
                            {count || 0}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default CommentItem;
