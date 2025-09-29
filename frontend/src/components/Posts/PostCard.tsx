'use client';

import Link from 'next/link';
import { Post } from '@/lib/slices/postsSlice';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            <Link 
              href={`/posts/${post.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          {!post.published && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {post.author?.name || 'Unknown'}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}