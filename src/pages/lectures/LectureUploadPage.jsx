import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import api from '../../api/axios';

function LectureUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError('');
    } else {
      setError('MP3 파일만 업로드 가능합니다.');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 토큰 확인
    console.log('Token:', localStorage.getItem('token'));
    
    if (!file || !title.trim()) {
      setError('파일과 제목을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Making API request with title:', title.trim());
      // 1. 먼저 강의 정보 생성 및 업로드 URL 요청
      const response = await api.post('/lectures', {
        title: title.trim()
      });
      console.log('API Response:', response);

      // 2. 파일을 binary로 변환
      const binaryData = await file.arrayBuffer();
      console.log('File prepared for upload');

      // 3. Presigned URL로 직접 S3에 업로드
      console.log('Uploading to S3 with URL:', response.data.uploadUrl);
      const uploadResponse = await fetch(response.data.uploadUrl, {
        method: 'PUT',
        body: binaryData,
        headers: {
          'Content-Type': 'audio/mpeg'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (!uploadResponse.ok) {
        console.error('S3 Upload failed:', uploadResponse);
        throw new Error('파일 업로드에 실패했습니다.');
      }
      
      console.log('S3 Upload successful');
      
      // 4. Step Function 시작
      console.log('Starting Step Function for lectureId:', response.data.lectureId);
      await api.post(`/lectures/${response.data.lectureId}/process`);
      
      navigate(`/lectures/${response.data.lectureId}`);
    } catch (err) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.error('Response headers:', err.response?.headers);
      setError(err.response?.data?.error || '강의 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">새 강의 업로드</h1>
      
      <Card>
        {error && <Alert variant="error" message={error} />}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="강의 제목"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-4"
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MP3 파일
            </label>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/lectures')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!file || !title.trim()}
            >
              업로드
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LectureUploadPage;