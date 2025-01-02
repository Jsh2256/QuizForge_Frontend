import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import lectureReducer from './lectures/lectureSlice';
import postReducer from './posts/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lectures: lectureReducer,
    posts: postReducer,
  },
});
