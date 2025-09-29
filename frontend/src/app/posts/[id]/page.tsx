'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPostById, deletePost } from '@/lib/slices/postsSlice';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error } = useAppSelector((state) => state.posts);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      const result = await dispatch(deletePost(postId));
      if (deletePost.fulfilled.match(result)) {
        router.push('/posts');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !currentPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error || 'The post you are looking for does not exist.'}
            </p>
            <Link
              href="/posts"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Posts
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isAuthor = user?.id === currentPost.authorId;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Post Header */}
            <header className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{currentPost.title}</h1>
                {!currentPost.published && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 text-sm">
                <span>By {currentPost.author?.name || 'Unknown'}</span>
                <span className="mx-2">•</span>
                <time dateTime={currentPost.createdAt}>
                  {formatDate(currentPost.createdAt)}
                </time>
                {currentPost.updatedAt !== currentPost.createdAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Updated {formatDate(currentPost.updatedAt)}</span>
                  </>
                )}
              </div>
            </header>

            {/* Post Content */}
            <div className="prose max-w-none mb-8">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {currentPost.content}
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && isAuthor && (
              <footer className="border-t pt-6">
                <div className="flex space-x-4">
                  <Link
                    href={`/edit-post/${currentPost.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Edit Post
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Delete Post
                  </button>
                </div>
              </footer>
            )}
          </div>
        </article>

        {/* Back to Posts */}
        <div className="mt-8">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </Layout>
  );
}