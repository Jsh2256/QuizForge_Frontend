import React from 'react';
import { useLocation } from 'react-router-dom';
import PostForm from '../../components/posts/PostForm';

function PostCreatePage() {
  const location = useLocation();
  const { questions, lectureId } = location.state || {};

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">문제 공유하기</h1>
      <PostForm questions={questions} lectureId={lectureId} />
    </div>
  );
}

export default PostCreatePage;
