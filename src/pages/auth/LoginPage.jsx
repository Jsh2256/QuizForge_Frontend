import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/auth/authSlice';
import LoginForm from '../../components/auth/LoginForm';
import api from '../../api/axios';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    try {
      const response = await api.post('/auth/login', formData);
      const { token, ...userData } = response.data;
      
      // Redux store 업데이트
      dispatch(login({ token, ...userData }));
      
      // 홈으로 리다이렉트
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    }
  };

  return <LoginForm onSubmit={handleLogin} error={error} />;
}

export default LoginPage;
