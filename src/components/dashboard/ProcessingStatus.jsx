import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import api from '../../api/axios';

const statusMap = {
  processing: { text: '처리 중', variant: 'warning' },
  transcribing: { text: '텍스트 변환 중', variant: 'warning' },
  transcribe_completed: { text: '텍스트 변환 완료', variant: 'info' },
  analyzing: { text: '분석 중', variant: 'info' },
  analyze_completed: { text: '분석 완료', variant: 'info' },
  generating_questions: { text: '문제 생성 중', variant: 'info' },
  questions_completed: { text: '문제 생성 완료', variant: 'success' },
  failed: { text: '실패', variant: 'error' }
};

function ProcessingStatus() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessingLectures = async () => {
      try {
        const response = await api.get('/lectures/user');
        const processing = response.data.filter(lecture => 
          lecture.processing?.processingState && 
          !['completed', 'failed'].includes(lecture.processing.processingState.toLowerCase())
        );
        setLectures(processing);
      } catch (error) {
        console.error('Error fetching processing lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingLectures();
    const interval = setInterval(fetchProcessingLectures, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (lectures.length === 0) {
    return <div className="text-gray-500">처리 중인 강의가 없습니다.</div>;
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
            <Badge variant={statusMap[lecture.processing?.processingState]?.variant || 'gray'}>
              {statusMap[lecture.processing?.processingState]?.text || lecture.processing?.processingState}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProcessingStatus;
