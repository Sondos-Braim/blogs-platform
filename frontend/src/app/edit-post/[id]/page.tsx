'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import PostForm from '@/components/Posts/PostForm';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPostById, updatePost, clearError, clearCurrentPost } from '@/lib/slices/postsSlice';

export default function EditPostPage() {
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

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, postId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if current user is the author
    if (currentPost && user?.id !== currentPost.authorId) {
      router.push('/posts');
    }
  }, [isAuthenticated, currentPost, user, router]);

  const handleSubmit = async (postData: { title: string; content: string; published: boolean }) => {
    if (!postId) return;
    
    const result = await dispatch(updatePost({ id: postId, postData }));
    if (updatePost.fulfilled.match(result)) {
      router.push(`/posts/${postId}`);
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Redirecting to login...</p>
        </div>
      </Layout>
    );
  }

  if (!currentPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.id !== currentPost.authorId) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You can only edit your own posts.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="mt-2 text-gray-600">
            Update your post content and settings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <PostForm
          initialData={currentPost}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
}