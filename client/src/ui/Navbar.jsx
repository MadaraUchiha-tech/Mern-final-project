import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, toggleAuthModal, setAuthMode } from '../slices/authSlice.js'

export default function Navbar() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((s) => s.auth)
  return (
    <header className="bg-white/70 dark:bg-black/30 backdrop-blur sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="font-semibold">Forum</Link>
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link to={`/u/${user?.username || 'me'}`} className="text-sm">{user?.username || 'Profile'}</Link>
              <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => {dispatch(setAuthMode('login')); dispatch(toggleAuthModal(true))}}>Login</button>
              <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => {dispatch(setAuthMode('register')); dispatch(toggleAuthModal(true))}}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
