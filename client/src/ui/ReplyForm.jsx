import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { addReply } from '../slices/postsSlice.js'
import { toggleAuthModal } from '../slices/authSlice.js'

export default function ReplyForm({ postId }) {
  const dispatch = useDispatch()
  const { token, status } = useSelector((s) => s.auth)
  const [content, setContent] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!token) return dispatch(toggleAuthModal(true))
    dispatch(addReply({ id: postId, content })).then(() => setContent(''))
  }

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
      <textarea className="w-full border p-2 rounded" rows={3} placeholder="Write a reply..." value={content} onChange={(e)=>setContent(e.target.value)} />
      <div className="mt-2 text-right">
        <button className="px-3 py-1 rounded bg-blue-600 text-white">Reply</button>
      </div>
    </form>
  )
}
