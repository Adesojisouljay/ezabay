import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunityPosts } from "../../hive-client";
import "./index.scss";
import distrator from "../../assets/distrator-logo-no-bg.jpg"
import { GoGift } from "react-icons/go";
import { FaRetweet } from "react-icons/fa";

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

    function timeAgo(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const secondsAgo = Math.floor((now - postDate) / 1000);
      
        if (secondsAgo < 60) {
          return `${secondsAgo} seconds ago`;
        } else if (secondsAgo < 3600) {
          const minutes = Math.floor(secondsAgo / 60);
          return `${minutes} minutes ago`;
        } else if (secondsAgo < 86400) {
          const hours = Math.floor(secondsAgo / 3600);
          return `${hours} hours ago`;
        } else {
          const days = Math.floor(secondsAgo / 86400);
          return `${days} days ago`;
        }
      }
    console.log(posts)
    

    return (
        <div className="spend-hbd-container">
            <div className="spend-hbd-wrapper">
                <div className="cover-wrapper">
                    <img src={distrator} alt="" />
                </div>
                <div className={`posts-grid ${loading && posts.length === 0 ? "loading" : ""}`}>
                    {loading && posts.length === 0 ? (
                        <div className="loader-wrapper">
                            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

                            <h2>Loading posts...</h2>
                        </div>
                    ) : posts.length ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="post-card"
                                onClick={() => handlePostClick(post.author, post.permlink)}
                            >
                                <div className="info-wrap">
                                    <span>{post.author}</span>
                                     <span className="time wrap">{timeAgo(post.created)}</span>
                                </div>
                                {post.body && (
                                    <>
                                        {extractImageUrl(post.body) && (
                                            <div className="wrap-img">
                                            <img 
                                                src={extractImageUrl(post.body)} 
                                                alt={post.title} 
                                                className="post-image" 
                                            />
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="wrap-content">
                                <h2 className="post-title">{post.title.substring(0, 30)}...</h2>
                                <p className="post-body">
                                    {cleanPostBody(post.body).length > 200 
                                        ? `${cleanPostBody(post.body).substring(0, 200)}...` 
                                        : cleanPostBody(post.body)}
                                </p>
                                <div className="info-wrap-down">
                                    <div className="reward-wrap">
                                    <GoGift /> <span>{post.payout.toFixed(2)}</span> 
                                    </div>
                                    <div className="reward-wrap">
                                    <FaRetweet /> <span>{post.reblogs}</span> 
                                    </div>
                                </div>
                                </div>
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
