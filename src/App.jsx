import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store/auth/authSlice';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LectureListPage from './pages/lectures/LectureListPage';
import LectureDetailPage from './pages/lectures/LectureDetailPage';
import LectureUploadPage from './pages/lectures/LectureUploadPage';
import PostListPage from './pages/posts/PostListPage';
import PostCreatePage from './pages/posts/PostCreatePage';
import PostDetailPage from './pages/posts/PostDetailPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지 로드 시 토큰 체크
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰이 있으면 로그인 상태로 설정
      dispatch(login({ token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/lectures" element={<LectureListPage />} />
          <Route path="/lectures/upload" element={<LectureUploadPage />} />
          <Route path="/lectures/:id" element={<LectureDetailPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
