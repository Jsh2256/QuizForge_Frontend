import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import api from '../../api/axios';

function RecentLectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLectures = async () => {
      try {
        const response = await api.get('/lectures/user');
        const completed = response.data
          .filter(lecture => 
            lecture.processing?.processingState === 'questions_completed' || 
            lecture.processing?.processingState === 'completed'
          )
          .slice(0, 5); // 최근 5개만 표시
        setLectures(completed);
      } catch (error) {
        console.error('Error fetching recent lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLectures();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (lectures.length === 0) {
    return <div className="text-gray-500">완료된 강의가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {lectures.map((lecture) => (
        <Link
          key={lecture.lectureId}
          to={`/lectures/${lecture.lectureId}`}
          className="block"
        >
          <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {lecture.title || '제목 없음'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(lecture.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {lecture.analysis && (
                <Badge variant="info">분석 완료</Badge>
              )}
              {lecture.questions && (
                <Badge variant="success">문제 생성 완료</Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
      <div className="text-right">
        <Link
          to="/lectures"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          모든 강의 보기
        </Link>
      </div>
    </div>
  );
}

export default RecentLectures;
