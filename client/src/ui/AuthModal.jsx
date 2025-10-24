import { useDispatch, useSelector } from 'react-redux'
import { login, register, toggleAuthModal } from '../slices/authSlice.js'
import { useState } from 'react'

export default function AuthModal() {
  const dispatch = useDispatch()
  const { showAuthModal, authMode, status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '', username: '' })
  if (!showAuthModal) return null

  const onSubmit = (e) => {
    e.preventDefault()
    if (authMode === 'login') dispatch(login({ email: form.email, password: form.password }))
    else dispatch(register(form))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">{authMode === 'login' ? 'Login' : 'Sign up'}</h2>
          <button onClick={() => dispatch(toggleAuthModal(false))}>✕</button>
        </div>
        <form className="space-y-3" onSubmit={onSubmit}>
          {authMode === 'register' && (
            <input className="w-full border p-2 rounded" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          )}
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={status==='loading'} className="w-full py-2 rounded bg-blue-600 text-white">{status==='loading'?'...': (authMode==='login'?'Login':'Create account')}</button>
        </form>
      </div>
    </div>
  )
}
