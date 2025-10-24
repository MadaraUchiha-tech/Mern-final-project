import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, createPost, likePost } from '../slices/postsSlice.js'
import { toggleAuthModal } from '../slices/authSlice.js'

export default function PostList() {
  const dispatch = useDispatch()
  const { list, status } = useSelector((s) => s.posts)
  const { token } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ title: '', content: '', tags: '' })
  const [query, setQuery] = useState('')

  useEffect(() => { dispatch(fetchPosts()) }, [dispatch])

  const submitPost = (e) => {
    e.preventDefault()
    if (!token) return dispatch(toggleAuthModal(true))
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
    dispatch(createPost(payload)).then(() => setForm({ title: '', content: '', tags: '' }))
  }

  return (
    <div className="space-y-6">
      <form className="bg-white dark:bg-gray-800 p-4 rounded space-y-2" onSubmit={submitPost}>
        <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
        <textarea className="w-full border p-2 rounded" rows={3} placeholder="What's on your mind?" value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="tags (comma separated)" value={form.tags} onChange={(e)=>setForm({...form,tags:e.target.value})} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
      </form>

      <div className="flex gap-2 items-center">
        <input className="border p-2 rounded w-full" placeholder="Search by title or content" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <button className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={()=>dispatch(fetchPosts({ q: query }))}>Search</button>
      </div>

      {status==='loading' && <p>Loading...</p>}
      <ul className="space-y-3">
        {list.map(p => (
          <li key={p._id} className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <Link to={`/posts/${p._id}`} className="font-semibold">{p.title}</Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{p.content}</p>
            <div className="flex items-center gap-3 text-sm mt-2">
              <button onClick={()=>dispatch(likePost(p._id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Like • {Array.isArray(p.likes)?p.likes.length:p.likes||0}</button>
              <span>by {p.author?.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
