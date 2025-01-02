import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPostDetail, addComment, toggleLike, deletePost } from '../../store/posts/postSlice';
import { HeartIcon, ChatBubbleLeftIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import QuizMode from './QuizMode';

function PostDetail({ postId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [quizMode, setQuizMode] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostDetail(postId));
    }
  }, [dispatch, postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(addComment({ postId, content: comment })).unwrap();
      setComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleLike(postId)).unwrap();
    } catch (error) {
      console.error('좋아요 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!user || user.userId !== post.userId) {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (post.publishState === 'deleted') {
      alert('이미 삭제된 게시글입니다.');
      return;
    }

    if (window.confirm('게시글을 삭제하면 연관된 모든 데이터(댓글, 좋아요 등)가 함께 삭제됩니다.\n정말로 삭제하시겠습니까?')) {
      try {
        await dispatch(deletePost(postId)).unwrap();
        alert('게시글이 삭제되었습니다.');
        navigate('/posts');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;
  if (!post) return <Alert variant="error" message="게시글을 찾을 수 없습니다." />;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{post.title}</h1>
              {post.publishState === 'deleted' && (
                <span className="text-sm text-red-500">
                  (삭제된 게시글입니다)
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              {user && user.userId === post.userId && post.publishState === 'active' && (
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  삭제
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{post.username}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                {post.isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="ml-1">{post.likeCount || 0}</span>
              </button>
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span className="ml-1">{post.commentCount || 0}</span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-5 w-5" />
                <span className="ml-1">{post.viewCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            {post.content}
          </div>

          {post.questions && post.questions.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  📝 문제 모음 ({post.questions.length}개)
                </h2>
                <Button
                  variant="primary"
                  onClick={() => setQuizMode(!quizMode)}
                >
                  {quizMode ? '문제 목록으로' : '퀴즈 모드로 풀기'}
                </Button>
              </div>

              {quizMode ? (
                <QuizMode questions={post.questions} />
              ) : (
                <div className="space-y-8">
                  {post.questions.map((question, index) => (
                    <div key={question.questionId} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {question.questionType === 'descriptive' ? '서술형' : '객관식'} 문제
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            question.difficulty === '상' ? 'error' :
                            question.difficulty === '중' ? 'warning' : 'info'
                          }>
                            난이도: {question.difficulty}
                          </Badge>
                          <Badge variant="info">
                            {question.score}점
                          </Badge>
                          <Badge variant="secondary">
                            ⏱️ {question.expectedTime}분
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">💭 문제</h4>
                          <p className="text-gray-800 whitespace-pre-wrap">{question.content}</p>
                        </div>

                        {question.questionType === 'multiple_choice' && question.options && (
                          <div className="pl-4">
                            <h4 className="font-medium text-gray-900 mb-3">보기</h4>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex}
                                  className="flex items-start p-3 bg-gray-50 rounded-lg"
                                >
                                  <span className="font-medium text-gray-700 mr-2">
                                    {optionIndex + 1}.
                                  </span>
                                  <p className="text-gray-800">{option}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.answerGuideline && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">📌 답안 작성 가이드</h4>
                            <p className="text-blue-800">{question.answerGuideline}</p>
                          </div>
                        )}

                        {question.evaluationPoint && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-2">🎯 평가 포인트</h4>
                            <p className="text-purple-800">{question.evaluationPoint}</p>
                          </div>
                        )}

                        {question.intent && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">💡 출제 의도</h4>
                            <p className="text-green-800">{question.intent}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">댓글</h2>
            
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="댓글을 입력하세요..."
                />
                <Button type="submit" variant="primary">
                  작성
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {post.comments?.map((comment) => (
                <div key={comment.commentId} className="flex space-x-3">
                  <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {comment.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PostDetail;
