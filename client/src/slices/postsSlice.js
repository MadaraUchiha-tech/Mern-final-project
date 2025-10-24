import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (params, thunkAPI) => {
  try {
    const { data } = await api.get('/posts', { params })
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch posts')
  }
})

export const fetchPost = createAsyncThunk('posts/fetchOne', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/posts/${id}`)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch post')
  }
})

export const createPost = createAsyncThunk('posts/create', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/posts', payload)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to create post')
  }
})

export const likePost = createAsyncThunk('posts/like', async (id, thunkAPI) => {
  try {
    const { data } = await api.patch(`/posts/${id}/like`)
    return { id, ...data }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to like post')
  }
})

export const addReply = createAsyncThunk('posts/addReply', async ({ id, content, parentReply }, thunkAPI) => {
  try {
    const { data } = await api.post(`/posts/${id}/reply`, { content, parentReply })
    return { postId: id, reply: data }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to add reply')
  }
})

export const likeReply = createAsyncThunk('posts/likeReply', async ({ postId, replyId }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/posts/${postId}/replies/${replyId}/like`)
    return { postId, replyId, ...data }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to like reply')
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: { list: [], current: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s) => { s.status = 'loading' })
      .addCase(fetchPosts.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload })
      .addCase(fetchPosts.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload })
      .addCase(fetchPost.fulfilled, (s, a) => { s.current = a.payload })
      .addCase(createPost.fulfilled, (s, a) => { s.list.unshift(a.payload) })
      .addCase(likePost.fulfilled, (s, a) => {
        const post = s.list.find((p) => p._id === a.payload.id) || (s.current && s.current._id === a.payload.id ? s.current : null)
        if (post) {
          post.likes = Array(a.payload.likes).fill(0) // count only; API returns count
        }
      })
      .addCase(addReply.fulfilled, (s, a) => {
        if (s.current && s.current._id === a.payload.postId) {
          s.current.replies = s.current.replies || []
          s.current.replies.push(a.payload.reply)
        }
      })
  }
})

export default postsSlice.reducer
