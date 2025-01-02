import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import api from '../../api/axios';

const QuestionCard = ({ question, index, userAnswer, submitted, onAnswerChange }) => {
  const getAnswerClass = (option) => {
    if (!submitted) {
      return userAnswer === option 
        ? 'bg-blue-50 border border-blue-200' 
        : 'bg-gray-50 hover:bg-gray-100';
    }

    if (question.questionType === 'multiple_choice') {
      if (option === question.correctAnswer) {
        return 'bg-green-50 border border-green-200';
      }
      if (option === userAnswer) {
        return 'bg-red-50 border border-red-200';
      }
    }
    return 'bg-gray-50';
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900">
              Q{index + 1}. {question.content}
            </h4>
            <p className="text-sm text-gray-500">
              예상 소요 시간: {question.expectedTime}분
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="gray">{question.score}점</Badge>
            <Badge variant={
              question.difficulty === '상' ? 'error' :
              question.difficulty === '중' ? 'warning' : 'info'
            }>
              난이도: {question.difficulty}
            </Badge>
          </div>
        </div>

        {question.questionType === 'multiple_choice' ? (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div
                key={optionIndex}
                onClick={() => !submitted && onAnswerChange(question.questionId, option)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${getAnswerClass(option)}`}
              >
                {option}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="3"
              placeholder="답안을 입력하세요"
              value={userAnswer || ''}
              onChange={(e) => onAnswerChange(question.questionId, e.target.value)}
              disabled={submitted}
            />
          </div>
        )}

        {submitted && (
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
            {question.questionType === 'descriptive' && question.answerGuideline && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  답안 가이드라인
                </h5>
                <p className="text-gray-600">{question.answerGuideline}</p>
              </div>
            )}
            {question.explanation && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  해설
                </h5>
                <p className="text-gray-600">{question.explanation}</p>
              </div>
            )}
            {question.intent && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  출제 의도
                </h5>
                <p className="text-gray-600">{question.intent}</p>
              </div>
            )}
            {question.evaluationPoints && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  평가 포인트
                </h5>
                <ul className="list-disc list-inside text-gray-600">
                  {Array.isArray(question.evaluationPoints) ? 
                    question.evaluationPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))
                    : <p>{question.evaluationPoints}</p>
                  }
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default function QuestionList({ lectureId }) {
  const navigate = useNavigate();  
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [lectureId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/lectures/${lectureId}/questions`);
      console.log('Questions Data:', response.data);
      setQuestionsData(response.data);
      setUserAnswers({});
      setSubmitted(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('문제를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    setError('');
    
    try {
      await api.post(`/lectures/${lectureId}/questions`);
      await fetchQuestions();
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('문제 생성에 실패했습니다.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!questionsData?.questions) return 0;
    
    return questionsData.questions.reduce((sum, question) => {
      if (question.questionType === 'multiple_choice') {
        if (userAnswers[question.questionId] === question.correctAnswer) {
          return sum + question.score;
        }
      }
      return sum;
    }, 0);
  };

  const handleSubmit = () => {
    const unansweredQuestions = questionsData.questions.filter(
      q => !userAnswers[q.questionId]
    );

    if (unansweredQuestions.length > 0) {
      if (!window.confirm('아직 답변하지 않은 문제가 있습니다. 제출하시겠습니까?')) {
        return;
      }
    }

    setSubmitted(true);
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;
  if (!questionsData?.questions) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 mb-4">
          문제 생성이 진행 중입니다. 잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            생성된 문제 ({questionsData.statistics.totalQuestions}개)
          </h3>
          <p className="text-sm text-gray-500">
            총점: {questionsData.statistics.totalScore}점
            {submitted && ` / 획득 점수: ${calculateScore()}점`}
            <br />
            예상 소요 시간: {questionsData.statistics.totalTime}분
            <br />
            객관식: {questionsData.statistics.questionsByType.multiple_choice}개
            / 서술형: {questionsData.statistics.questionsByType.descriptive}개
          </p>
        </div>
        <div className="flex gap-4">
          {!submitted ? (
            <>
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                정답 제출하기
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate('/posts/create', {
                  state: { questions: questionsData.questions, lectureId }
                })}
              >
                문제 공유하기
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {questionsData.questions.map((question, index) => (
          <QuestionCard
            key={question.questionId}
            question={question}
            index={index}
            userAnswer={userAnswers[question.questionId]}
            submitted={submitted}
            onAnswerChange={handleAnswerChange}
          />
        ))}
      </div>
    </div>
  );
}