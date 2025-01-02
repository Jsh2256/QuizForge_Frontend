import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import api from '../../api/axios';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      navigate('/login', { 
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
      });
    } catch (err) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {error && (
          <div className="mb-4">
            <Alert variant="error" message={error} />
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            name="username"
            type="text"
            label="사용자 이름"
            required
            value={formData.username}
            onChange={handleChange}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="이메일"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="비밀번호"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="비밀번호 확인"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            회원가입
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                이미 계정이 있으신가요?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link 
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;