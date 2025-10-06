import { useEffect, useRef, useState } from 'react'

export default function Navbar({ onMenuClick }) {
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
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        {/* Botón menú hamburguesa para móvil */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="md:hidden font-semibold text-lg">ChargeGO</div>
      </div>
      
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm"
          style={{background: 'var(--btn)', color: 'var(--btn-text)'}}
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


