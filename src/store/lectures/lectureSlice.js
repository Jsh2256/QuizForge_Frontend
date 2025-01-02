import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchUserLectures = createAsyncThunk(
  'lectures/fetchUserLectures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/lectures/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || '강의 목록을 불러오는데 실패했습니다.');
    }
  }
);

export const uploadLecture = createAsyncThunk(
  'lectures/uploadLecture',
  async (youtubeUrl, { rejectWithValue }) => {
    try {
      const response = await api.post('/lectures', { youtubeUrl });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || '강의 업로드에 실패했습니다.');
    }
  }
);

const initialState = {
  lectures: [],
  currentLecture: null,
  loading: false,
  error: null,
};

const lectureSlice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    setCurrentLecture: (state, action) => {
      state.currentLecture = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 강의 목록 조회
      .addCase(fetchUserLectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(fetchUserLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 강의 업로드
      .addCase(uploadLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures.push(action.payload);
      })
      .addCase(uploadLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentLecture, clearError } = lectureSlice.actions;
export default lectureSlice.reducer;
