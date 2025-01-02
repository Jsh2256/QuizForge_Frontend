import React, { useState, useEffect } from 'react';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Badge from '../common/Badge';
import api from '../../api/axios';

function AnalysisResult({ lectureId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/lectures/${lectureId}/analysis`);
        console.log('API Response:', response.data); // API 응답 확인
        setAnalysis(response.data); // API 응답 데이터를 직접 설정
      } catch (err) {
        console.error('API 요청 실패:', err); // 오류 로그 출력
        setError('분석 결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [lectureId]);

  if (loading) return <Loading />;
  if (error) return <Alert variant="error" message={error} />;
  if (!analysis) return (
    <Alert 
      variant="info" 
      message="분석이 진행 중입니다. 잠시만 기다려주세요." 
    />
  );

  return (
    <div className="space-y-6">
      {/* 키워드 분석 */}
      {analysis.keyPhrases && analysis.keyPhrases.length > 0 && (
        <Card title="주요 키워드">
          <div className="flex flex-wrap gap-2">
            {analysis.keyPhrases.map((keyword, index) => (
              <Badge key={index} variant="info">
                {keyword}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* 엔티티 분석 */}
      {analysis.entities && Object.keys(analysis.entities).length > 0 && (
        <Card title="주요 개체">
          <div className="space-y-4">
            {Object.entries(analysis.entities).map(([type, entities]) => (
              <div key={type}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{type}</h4>
                <div className="flex flex-wrap gap-2">
                  {entities.map((entity, index) => (
                    <Badge key={index} variant="gray">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 감정 분석 */}
      {analysis.sentiment && (
        <Card title="감정 분석">
          <div className="space-y-4">
            {analysis.sentiment.predominant && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  주요 감정: {analysis.sentiment.predominant}
                </p>
              </div>
            )}
            {analysis.sentiment.scores && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analysis.sentiment.scores).map(([sentiment, score]) => (
                  <div key={sentiment} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">{sentiment}</div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${score * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {(score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default AnalysisResult;
