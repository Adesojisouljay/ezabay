import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunityPosts } from "../../hive-client";
import "./index.scss";

export const SpendHbd = () => {
    const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState(20);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const communityPosts = await getCommunityPosts("trending", limit);
                setPosts(prevPosts => [...prevPosts, ...communityPosts]);
            } catch (error) {
                console.error("Failed to fetch community posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [limit]);

    const handlePostClick = (postId) => {
        navigate(`/spendhbd/post${postId}`);
    };

    const extractImageUrl = (body) => {
        const imageRegex = /!\[.*?\]\((.*?)\)/;
        const match = body.match(imageRegex);
        return match ? match[1] : null;
    };

    const cleanPostBody = (body) => {
        const cleanedBody = body.replace(/<\/?[^>]+(>|$)/g, "");
        return cleanedBody
            .replace(/!\[.*?\]\(.*?\)/g, "")
            .replace(/\[.*?\]\(.*?\)/g, "");
    };

    const loadMorePosts = () => {
        setLimit(limit + 20);
    };

    return (
        <div className="spend-hbd-container">
            <div className="spend-hbd-wrapper">
                <h1>Community Posts</h1>
                <div className="posts-grid">
                    {loading && posts.length === 0 ? (
                        <h2>Loading posts...</h2>
                    ) : posts.length ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="post-card"
                                onClick={() => handlePostClick(post.id)}
                            >
                                {post.body && (
                                    <>
                                        {extractImageUrl(post.body) && (
                                            <img 
                                                src={extractImageUrl(post.body)} 
                                                alt={post.title} 
                                                className="post-image" 
                                            />
                                        )}
                                    </>
                                )}
                                <h2 className="post-title">{post.title.substring(0, 30)}...</h2>
                                <p>Created: 5 days ago</p>
                                <p className="post-body">
                                    {cleanPostBody(post.body).length > 200 
                                        ? `${cleanPostBody(post.body).substring(0, 200)}...` 
                                        : cleanPostBody(post.body)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
                {posts.length > 0 && (
                    <button className="load-more-btn" onClick={loadMorePosts} disabled={loading}>
                        {loading ? "Loading..." : "Load more"}
                    </button>
                )}
            </div>
        </div>
    );
};
