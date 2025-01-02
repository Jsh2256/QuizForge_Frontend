import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Badge from '../common/Badge';

function PostCard({ post }) {
  return (
    <Link 
      to={`/posts/${post.postId}`}
      className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {post.username} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="info">
            {post.questions?.length || 0}문제
          </Badge>
        </div>

        <p className="mt-4 text-gray-600 line-clamp-3">{post.content}</p>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center text-gray-500">
            {post.isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="ml-1.5 text-sm">{post.likeCount || 0}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span className="ml-1.5 text-sm">{post.commentCount || 0}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <EyeIcon className="h-5 w-5" />
            <span className="ml-1.5 text-sm">{post.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
