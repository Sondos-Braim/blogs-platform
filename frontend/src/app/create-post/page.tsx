'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import PostForm from '@/components/Posts/PostForm';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createPost, clearError } from '@/lib/slices/postsSlice';

export default function CreatePostPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.posts);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (postData: { title: string; content: string; published: boolean }) => {
    const result = await dispatch(createPost(postData));
    if (createPost.fulfilled.match(result)) {
      router.push('/posts');
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

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="mt-2 text-gray-600">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <PostForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
}