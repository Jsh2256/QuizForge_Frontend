import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../store/posts/postSlice';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Badge from '../common/Badge';

function PostForm({ questions = [], lectureId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    selectedQuestions: [],
    lectureId: lectureId
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 문제가 없을 경우 안내 메시지 표시
  if (questions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">공유할 문제가 없습니다.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/lectures')}
          >
            강의로 돌아가기
          </Button>
        </div>
      </Card>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionSelect = (question) => {
    setFormData(prev => {
      const isSelected = prev.selectedQuestions.includes(question);
      return {
        ...prev,
        selectedQuestions: isSelected
          ? prev.selectedQuestions.filter(q => q !== question)
          : [...prev.selectedQuestions, question]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedQuestions.length === 0) {
      setError('최소 1개 이상의 문제를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        questions: formData.selectedQuestions.map(q => q.questionId),
        lectureId: formData.lectureId
      };
      
      await dispatch(createPost(postData)).unwrap();
      navigate(`/lectures/${lectureId}`);  // 수정된 부분: 강의 상세 페이지로 이동
    } catch (err) {
      setError(err.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="error" message={error} />
        )}

        <Input
          label="제목"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <textarea
            name="content"
            rows="4"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">공유할 문제 선택</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer ${
                  formData.selectedQuestions.includes(question)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleQuestionSelect(question)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-gray-900">
                    Q{index + 1}. {question.content}
                  </h4>
                  <Badge variant={
                    question.difficulty === '상' ? 'error' :
                    question.difficulty === '중' ? 'warning' : 'info'
                  }>
                    난이도: {question.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            공유하기
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default PostForm;
