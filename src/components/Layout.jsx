import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
export default function Layout() {
  const navigate = useNavigate()
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) navigate('/login')
  }, [navigate])

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


