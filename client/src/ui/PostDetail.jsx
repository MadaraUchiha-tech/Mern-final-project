import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchPost, addReply, likePost, likeReply } from '../slices/postsSlice.js'
import ReplyForm from './ReplyForm.jsx'

export default function PostDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current } = useSelector((s) => s.posts)
  const { token } = useSelector((s) => s.auth)
  const [reply, setReply] = useState('')

  useEffect(() => { if (id) dispatch(fetchPost(id)) }, [id, dispatch])

  if (!current) return <p>Loading...</p>

  return (
    <article className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold">{current.title}</h1>
        <p className="mt-2">{current.content}</p>
        <div className="mt-2 text-sm flex items-center gap-3">
          <button onClick={()=>dispatch(likePost(current._id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Like • {current.likes?.length||0}</button>
          <span>by {current.author?.username}</span>
        </div>
      </div>

      <section>
        <h2 className="font-semibold mb-2">Replies</h2>
        <div className="space-y-2">
          {current.replies?.map(r => (
            <div key={r._id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-300">{r.author?.username}</div>
              <div>{r.content}</div>
              <button onClick={()=>dispatch(likeReply({ postId: current._id, replyId: r._id }))} className="mt-1 text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Like • {r.likes?.length||0}</button>
            </div>
          ))}
        </div>
      </section>

      <ReplyForm postId={current._id} />
    </article>
  )
}
