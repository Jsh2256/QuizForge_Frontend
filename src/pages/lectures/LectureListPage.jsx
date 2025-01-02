import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LectureCard from '../../components/lectures/LectureCard';
import Loading from '../../components/common/Loading';
import api from '../../api/axios';

function LectureListPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await api.get('/lectures/user');
        setLectures(response.data);
      } catch (err) {
        setError('강의 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">내 강의</h1>
        <Link
          to="/lectures/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          새 강의 업로드
        </Link>
      </div>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {lectures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 업로드한 강의가 없습니다.</p>
          <Link
            to="/lectures/upload"
            className="text-blue-600 hover:text-blue-800"
          >
            첫 강의 업로드하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.lectureId} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LectureListPage;
