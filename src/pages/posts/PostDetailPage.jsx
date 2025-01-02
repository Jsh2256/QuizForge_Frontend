import React from 'react';
import { useParams } from 'react-router-dom';
import PostDetail from '../../components/posts/PostDetail';

function PostDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostDetail postId={id} />
    </div>
  );
}

export default PostDetailPage;
