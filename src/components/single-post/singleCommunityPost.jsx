import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../hive-client/server';
import { marked } from 'marked';
import './index.scss';

export const SingleCommunityPost = () => {
    const { author, permlink } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await getPost(author, permlink);
                console.log(fetchedPost)
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    throw new Error("Post not found.");
                }
            } catch (error) {
                setError(error.message);
                console.error("Error fetching single post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [author, permlink]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return <h2 className="loading-message">Loading post...</h2>;
    }

    if (error) {
        return <h2 className="error-message">{error}</h2>;
    }

    if (!post) {
        return <h2 className="not-found-message">Post not found.</h2>;
    }

    return (
        <div className="single-community-post">
            <div className='single-community-wrapper'>
                <h1 className="post-title">{post.title}</h1>
                <p className="post-date">
                    Created: {post.created ? formatDate(post.created) : 'Unknown date'}
                </p>
                <div
                    className="post-body"
                    dangerouslySetInnerHTML={{ __html: marked.parse(post.body) }}
                />
            </div>
        </div>
    );
};
