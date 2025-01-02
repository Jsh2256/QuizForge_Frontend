import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../store/posts/postSlice';
import PostCard from './PostCard';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import Pagination from '../common/Pagination';

function PostList() {
  const dispatch = useDispatch();
  const { posts, pagination, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    loadPosts();
  }, [dispatch, sortBy, order]);

  const loadPosts = (page = 1) => {
    dispatch(fetchPosts({ page, sortBy, order }));
  };

  const handlePageChange = (newPage) => {
    loadPosts(newPage);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = () => {
    setOrder(order === 'desc' ? 'asc' : 'desc');
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">문제 공유 게시판</h1>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="rounded-md border-gray-300"
          >
            <option value="createdAt">최신순</option>
            <option value="likeCount">좋아요순</option>
            <option value="viewCount">조회수순</option>
            <option value="commentCount">댓글순</option>
          </select>
          <button
            onClick={handleOrderChange}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {order === 'desc' ? '내림차순' : '오름차순'}
          </button>
          {user && (
            <Link
              to="/posts/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              문제 공유하기
            </Link>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 공유된 문제가 없습니다.</p>
          {user && (
            <Link
              to="/posts/create"
              className="text-blue-600 hover:text-blue-800"
            >
              첫 문제를 공유해보세요!
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default PostList;
