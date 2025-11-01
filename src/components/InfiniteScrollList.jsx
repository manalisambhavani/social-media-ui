import React, { useEffect, useRef } from 'react';

const InfiniteScrollList = ({ loadMore, hasMore, children, loading }) => {
    const loaderRef = useRef();

    useEffect(() => {
        if (!hasMore || loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { threshold: 1.0 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    return (
        <>
            {children}
            {hasMore && (
                <div ref={loaderRef} style={{ textAlign: 'center', padding: 16 }}>
                    {loading ? 'Loading more...' : ''}
                </div>
            )}
        </>
    );
};

export default InfiniteScrollList;
