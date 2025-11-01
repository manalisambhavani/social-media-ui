import { useState } from 'react';
import { IconButton, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { reactionService } from '../services/reactionService';


const reactions = [
    { name: 'like', icon: <ThumbUpIcon /> },
    { name: 'love', icon: <FavoriteIcon /> },
    { name: 'happy', icon: <EmojiEmotionsIcon /> },
];


export default function ReactionButtons({ post }) {
    const [selected, setSelected] = useState(post.UserReaction?.ReactionName || '');


    const handleReaction = async (name) => {
        if (selected === name) {
            await reactionService.deletePostReaction(post.UserReaction?.id);
            setSelected('');
        } else {
            await reactionService.addPostReaction(post.id, name);
            setSelected(name);
        }
    };


    return (
        <Stack direction="row" spacing={1}>
            {reactions.map((r) => (
                <IconButton key={r.name} color={selected === r.name ? 'primary' : 'default'} onClick={() => handleReaction(r.name)}>
                    {r.icon}
                </IconButton>
            ))}
        </Stack>
    );
}