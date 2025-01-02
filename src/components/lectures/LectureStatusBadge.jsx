import React from 'react';
import Badge from '../common/Badge';

const statusMap = {
  processing: { text: '처리 중', variant: 'warning' },
  transcribing: { text: '텍스트 변환 중', variant: 'warning' },
  analyzing: { text: '분석 중', variant: 'info' },
  generating_questions: { text: '문제 생성 중', variant: 'info' },
  completed: { text: '완료', variant: 'success' },
  failed: { text: '실패', variant: 'error' }
};

function LectureStatusBadge({ status }) {
  const statusInfo = statusMap[status] || { text: status, variant: 'gray' };

  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.text}
    </Badge>
  );
}

export default LectureStatusBadge;
