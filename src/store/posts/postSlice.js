import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      console.log('📝 Creating post:', postData);
      const response = await api.post('/posts', postData);
      console.log('✅ Post created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create post error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '게시글 작성에 실패했습니다.');
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching posts with params:', params);
      const response = await api.get('/posts', { params });
      console.log('✅ Posts fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Fetch posts error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '게시글 목록을 불러오는데 실패했습니다.');
    }
  }
);

export const fetchPostDetail = createAsyncThunk(
  'posts/fetchPostDetail',
  async (postId, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching post detail:', postId);
      const response = await api.get(`/posts/${postId}`);
      console.log('✅ Post detail fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Fetch post detail error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '게시글을 불러오는데 실패했습니다.');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      console.log('📝 Updating post:', { postId, postData });
      const response = await api.put(`/posts/${postId}`, postData);
      console.log('✅ Post updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update post error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '게시글 수정에 실패했습니다.');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting post:', postId);
      await api.delete(`/posts/${postId}`);
      console.log('✅ Post deleted:', postId);
      return postId;
    } catch (error) {
      console.error('❌ Delete post error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '게시글 삭제에 실패했습니다.');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      console.log('💬 Adding comment:', { postId, content });
      const response = await api.post(`/posts/${postId}/comments`, { content });
      console.log('✅ Comment added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Add comment error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '댓글 작성에 실패했습니다.');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      console.log('❤️ Toggling like:', postId);
      const response = await api.post(`/posts/${postId}/like`);
      console.log('✅ Like toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Toggle like error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || '좋아요 처리에 실패했습니다.');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    pagination: {
      total: 0,
      page: 1,
      totalPages: 1,
      limit: 10
    },
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchPostDetail
      .addCase(fetchPostDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updatePost
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.postId === action.payload.postId);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.postId === action.payload.postId) {
          state.currentPost = action.payload;
        }
      })
      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.postId !== action.payload);
        if (state.currentPost?.postId === action.payload) {
          state.currentPost = null;
        }
      })
      // addComment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentPost) {
          state.currentPost.comments = state.currentPost.comments || [];
          state.currentPost.comments.push(action.payload);
          state.currentPost.commentCount = (state.currentPost.commentCount || 0) + 1;
        }
      })
      // toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.currentPost) {
          state.currentPost.likeCount = action.payload.liked 
            ? (state.currentPost.likeCount || 0) + 1 
            : (state.currentPost.likeCount || 1) - 1;
          state.currentPost.isLiked = action.payload.liked;
        }
      });
  }
});

export const { clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
