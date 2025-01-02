import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import RecentLectures from '../../components/dashboard/RecentLectures';
import ProcessingStatus from '../../components/dashboard/ProcessingStatus';

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <Link
          to="/lectures/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          새 강의 업로드
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="처리 중인 강의">
          <ProcessingStatus />
        </Card>
        <Card title="최근 강의">
          <RecentLectures />
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
