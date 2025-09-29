'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import PostCard from '@/components/Posts/PostCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/lib/slices/postsSlice';
import { PostsService } from '@/services/postsService';
import { Post } from '@/lib/slices/postsSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((state) => state.posts);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (isAuthenticated && user?.id) {
        setLoadingUserPosts(true);
        try {
          const posts = await PostsService.getUserPosts(user.id);
          setUserPosts(posts);
        } catch (error) {
          console.error('Failed to fetch user posts:', error);
        } finally {
          setLoadingUserPosts(false);
        }
      }
    };

    fetchUserPosts();
  }, [isAuthenticated, user]);

  const recentPosts = posts.slice(0, 3);
  const hasUserPosts = userPosts.length > 0;

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">BlogPlatform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Share your thoughts, stories, and ideas with the world. Join our community of writers and readers.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isAuthenticated ? (
              <Link
                href="/create-post"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {hasUserPosts ? 'Write Another Post' : 'Write Your First Post'}
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            <Link
              href="/posts"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              View all posts →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to write one!</p>
            </div>
          )}
        </div>

        {/* User's Posts Section (if authenticated) */}
        {isAuthenticated && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
              <Link
                href="/my-posts"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View all your posts →
              </Link>
            </div>

            {loadingUserPosts ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userPosts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't created any posts yet.</p>
                <Link
                  href="/create-post"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Create your first post →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}