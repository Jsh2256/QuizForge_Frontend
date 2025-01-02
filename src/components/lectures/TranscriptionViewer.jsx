import React, { useState, useEffect } from 'react';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import Badge from '../common/Badge';
import api from '../../api/axios';

function TranscriptionViewer({ lectureId }) {
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTranscription = async () => {
      try {
        const response = await api.get(`/lectures/${lectureId}/transcription/result`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.transcript) {
          setTranscription({
            transcript: response.data.transcript
          });
        } else {
          setError('변환된 텍스트를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Transcription error:', err);
        setError('텍스트 변환 결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (lectureId) {
      fetchTranscription();
    }
  }, [lectureId]);

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;
  if (!transcription) return (
    <Alert 
      variant="info" 
      message="텍스트 변환이 진행 중입니다. 잠시만 기다려주세요." 
    />
  );

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h3 className="text-lg font-medium text-gray-900 mb-4">전체 텍스트</h3>
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {transcription.transcript}
        </div>
      </div>
    </div>
  );
}

export default TranscriptionViewer;
