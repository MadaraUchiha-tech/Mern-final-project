import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('token', data.token)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Register failed')
  }
})

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', payload)
    localStorage.setItem('token', data.token)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Login failed')
  }
})

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
  showAuthModal: false,
  authMode: 'login',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    toggleAuthModal(state, action) {
      state.showAuthModal = action.payload ?? !state.showAuthModal
    },
    setAuthMode(state, action) {
      state.authMode = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(register.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload.user; s.token = a.payload.token; s.showAuthModal = false })
      .addCase(register.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload })
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload.user; s.token = a.payload.token; s.showAuthModal = false })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload })
  }
})

export const { logout, toggleAuthModal, setAuthMode } = authSlice.actions
export default authSlice.reducer
