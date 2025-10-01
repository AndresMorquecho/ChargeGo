import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="md:hidden font-semibold">ChargeGO</div>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
        >
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs">
            {(user?.name || 'A')[0]}
          </span>
          <span>Perfil</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-50">
            <div className="flex items-center gap-3 pb-3 border-b">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {(user?.name || 'A')[0]}
              </div>
              <div>
                <div className="text-sm font-medium">{user?.name || 'Administrador'}</div>
                <div className="text-xs text-gray-500">{user?.username || 'admin'}</div>
              </div>
            </div>
            <button onClick={logout} className="mt-3 w-full px-3 py-2 text-left rounded-md hover:bg-gray-50 text-sm">Salir</button>
          </div>
        )}
      </div>
    </header>
  )
}


