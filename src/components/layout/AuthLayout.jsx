import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuizForgeLogo from '../../assets/quizforge192.png';

function AuthLayout() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={QuizForgeLogo}
            alt="Quiz Forge Logo"
            className="h-16 w-auto"
          />
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            Quiz Forge
          </h2>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
