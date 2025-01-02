import React, { useState } from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Card from '../common/Card';

function QuizMode({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions?.[currentIndex];
  const totalQuestions = questions?.length || 0;

  const handleAnswer = (answer) => {
    if (!showAnswer) {
      setUserAnswers(prev => ({
        ...prev,
        [currentIndex]: answer
      }));
    }
  };

  const getAnswerClass = (option) => {
    if (!showAnswer) {
      return userAnswers[currentIndex] === option 
        ? 'bg-blue-50 border border-blue-200' 
        : 'bg-gray-50 hover:bg-gray-100';
    }

    if (currentQuestion.questionType === 'multiple_choice') {
      if (option === currentQuestion.correctAnswer) {
        return 'bg-green-50 border border-green-200';
      }
      if (option === userAnswers[currentIndex]) {
        return 'bg-red-50 border border-red-200';
      }
    }
    return 'bg-gray-50';
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">퀴즈 문제가 없습니다.</p>
      </div>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* 문제 헤더 */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900">
              Q{currentIndex + 1}. {currentQuestion.content}
            </h4>
            <p className="text-sm text-gray-500">
              예상 소요 시간: {currentQuestion.expectedTime}분
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="gray">{currentQuestion.score}점</Badge>
            <Badge variant={
              currentQuestion.difficulty === '상' ? 'error' :
              currentQuestion.difficulty === '중' ? 'warning' : 'info'
            }>
              난이도: {currentQuestion.difficulty}
            </Badge>
          </div>
        </div>

        {/* 답안 입력 영역 */}
        {currentQuestion.questionType === 'multiple_choice' ? (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, optionIndex) => (
              <div
                key={optionIndex}
                onClick={() => !showAnswer && handleAnswer(option)}
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
              value={userAnswers[currentIndex] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={showAnswer}
            />
          </div>
        )}

        {/* 정답 및 해설 */}
        {showAnswer && (
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
            {currentQuestion.questionType === 'descriptive' && currentQuestion.answerGuideline && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  모범 답안
                </h5>
                <p className="text-gray-600">{currentQuestion.answerGuideline}</p>
              </div>
            )}
            {currentQuestion.evaluationPoint && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  평가 포인트
                </h5>
                <p className="text-gray-600">{currentQuestion.evaluationPoint}</p>
              </div>
            )}
            {currentQuestion.intent && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  출제 의도
                </h5>
                <p className="text-gray-600">{currentQuestion.intent}</p>
              </div>
            )}
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-4">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            이전 문제
          </Button>
          <div className="space-x-4">
            {!showAnswer && (
              <Button
                variant="primary"
                onClick={() => setShowAnswer(true)}
                disabled={!userAnswers[currentIndex]}
              >
                정답 확인
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={currentIndex === totalQuestions - 1}
            >
              다음 문제
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default QuizMode;
