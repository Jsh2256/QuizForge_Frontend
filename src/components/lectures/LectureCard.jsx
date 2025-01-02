import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import LectureStatusBadge from './LectureStatusBadge';
import Button from '../common/Button';
import { PlayCircleIcon, DocumentTextIcon, LightBulbIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';

function LectureCard({ lecture, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('이 강의를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setIsDeleting(true);
            setError('');
            await api.delete(`/lectures/${lecture.lectureId}`);
            if (onDelete) {
                onDelete(lecture.lectureId);
            }
        } catch (err) {
            setError('강의 삭제에 실패했습니다.');
            console.error('Delete error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/lectures/${lecture.lectureId}`}>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            {lecture.title || '제목 없음'}
                        </h3>
                        <LectureStatusBadge status={lecture.lecturestatus} />
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500">
                        {new Date(lecture.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-4 flex items-center space-x-4">
                        {lecture.audioUrl && (
                            <div className="flex items-center text-gray-500">
                                <PlayCircleIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm">Audio</span>
                            </div>
                        )}
                        {lecture.transcriptUrl && (
                            <div className="flex items-center text-gray-500">
                                <DocumentTextIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm">Transcript</span>
                            </div>
                        )}
                        {lecture.questions && (
                            <div className="flex items-center text-gray-500">
                                <LightBulbIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm">Questions</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>
            </Link>
            
            <div className="absolute top-2 right-2">
                <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                    <TrashIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default LectureCard;
