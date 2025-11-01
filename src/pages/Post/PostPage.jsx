import { useEffect, useState, useCallback } from 'react';
import { postService } from '../../services/postService';
import {
    Container,
    Typography,
    CircularProgress,
    Fab,
    Box,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostCard from '../../components/PostCard';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollList from '../../components/InfiniteScrollList';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ useCallback ensures the same function reference across renders
    const fetchPosts = useCallback(async (reset = false) => {
        if (!hasNext || loading) return;
        setLoading(true);
        try {
            const res = await postService.list(page, 10);
            const newPosts = res.data.data || [];

            // avoid duplicates if API sometimes repeats previous items
            setPosts((prev) => {
                const ids = new Set(prev.map((p) => p.id));
                const uniqueNew = newPosts.filter((p) => !ids.has(p.id));
                return [...prev, ...uniqueNew];
            });

            setHasNext(res.data.pagination?.hasNextPage);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    }, [page, loading]);

    const handlePostUpdated = (updatedPost) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                setPage((p) => p + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Container sx={{ position: 'relative', mt: 3 }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/posts/create')}
                sx={{ mb: 2 }}
            >
                Create Post
            </Button>

            <InfiniteScrollList
                loadMore={() => !loading && setPage((p) => p + 1)} // 👈 block during reload
                hasMore={!loading && hasNext}
                loading={loading}
            >
                {posts.map((p) => (
                    <PostCard key={p.id} post={p} onUpdated={handlePostUpdated} />
                ))}
            </InfiniteScrollList>

            {loading && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
}
