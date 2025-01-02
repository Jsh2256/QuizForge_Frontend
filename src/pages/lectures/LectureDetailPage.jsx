import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import LectureStatusBadge from '../../components/lectures/LectureStatusBadge';
import TranscriptionViewer from '../../components/lectures/TranscriptionViewer';
import AnalysisResult from '../../components/lectures/AnalysisResult';
import QuestionList from '../../components/lectures/QuestionList';
import api from '../../api/axios';

function LectureDetailPage() {
  const { id: lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await api.get(`/lectures/${lectureId}`);
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        console.log('Processing info:', response.data.processing);
        console.log('Audio URL:', response.data.signedUrl);
        setLecture(response.data);
      } catch (err) {
        console.error('Error fetching lecture:', err);
        setError('강의 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId]);

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;
  if (!lecture) return <Alert variant="error" message="강의를 찾을 수 없습니다." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {lecture.title || 'No Title'}
          </h1>
          <div className="mt-1 flex items-center space-x-4">
            <LectureStatusBadge status={lecture.lecturestatus} />
            <span className="text-gray-500">
              {new Date(lecture.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Link
          to="/lectures"
          className="text-blue-600 hover:text-blue-800"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
            }`
          }>
            오디오
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
            }`
          }>
            텍스트 변환
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
            }`
          }>
            분석 결과
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-800'
            }`
          }>
            문제
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white p-3">
            {lecture.signedUrl ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">오디오</h3>
                <audio 
                  controls 
                  className="w-full"
                  controlsList="nodownload"
                >
                  <source src={lecture.signedUrl} type="audio/mpeg" />
                  브라우저가 오디오 재생을 지원하지 않습니다.
                </audio>
              </div>
            ) : (
              <div className="text-gray-500">
                오디오 파일을 불러올 수 없습니다.
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3">
            <TranscriptionViewer lectureId={lectureId} />
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3">
            <AnalysisResult lectureId={lectureId} />
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3">
            <QuestionList lectureId={lectureId} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default LectureDetailPage;

