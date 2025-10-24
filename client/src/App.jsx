import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, createPost } from './slices/postsSlice.js'
import { toggleAuthModal } from './slices/authSlice.js'
import Navbar from './ui/Navbar.jsx'
import AuthModal from './ui/AuthModal.jsx'
import PostList from './ui/PostList.jsx'
import PostDetail from './ui/PostDetail.jsx'
import UserProfile from './ui/UserProfile.jsx'

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/u/:username" element={<UserProfile />} />
        </Routes>
      </main>
      <AuthModal />
    </div>
  )
}
