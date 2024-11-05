import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunityPosts } from "../../hive-client";
import "./index.scss";

export const SpendHbd = () => {
    const [posts, setPosts] = useState([]);
    const [limit] = useState(20);
    const [loading, setLoading] = useState(false);
    const [lastPost, setLastPost] = useState(null);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            setLoading(true);

            const communityPosts = await getCommunityPosts(
                "trending",
                limit,
                "",
                lastPost?.author,
                lastPost?.permlink
            );

            if (communityPosts && communityPosts.length > 0) {
                setPosts(prevPosts => [...prevPosts, ...communityPosts]);
                setLastPost(communityPosts[communityPosts.length - 1]);
            }
        } catch (error) {
            console.error("Failed to fetch community posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostClick = (author, permlink) => {
        navigate(`/post/${author}/${permlink}`);
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
        fetchPosts();
    };

    return (
        <div className="spend-hbd-container">
            <div className="spend-hbd-wrapper">
                <h1>Trending Posts on SpendHbd</h1>
                <div className="posts-grid">
                    {loading && posts.length === 0 ? (
                        <h2>Loading posts...</h2>
                    ) : posts.length ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="post-card"
                                onClick={() => handlePostClick(post.author, post.permlink)}
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
                                <p>Created: {post.created}</p>
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
