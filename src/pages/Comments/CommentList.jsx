import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CommentItem from './CommentItem';
import { commentService } from '../../services/commentService';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchComments = async (pageNum) => {
        setLoading(true);
        try {
            const res = await commentService.list(postId, pageNum, 10);
            const newComments = res.data.data;
            setComments((prev) => [...prev, ...newComments]);
            setHasNextPage(res.data.pagination?.hasNextPage);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setComments([]);
        setPage(1);
        fetchComments(1);
    }, [postId]);

    const lastCommentRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchComments(nextPage);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasNextPage, page]
    );

    return (
        <Box>
            {comments.map((c, index) => {
                if (index === comments.length - 1) {
                    return <CommentItem key={c.id} ref={lastCommentRef} comment={c} />;
                }
                return <CommentItem key={c.id} comment={c} />;
            })}
            {loading && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default CommentList;
