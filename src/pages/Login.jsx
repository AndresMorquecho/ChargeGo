import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Mock de validación local
    setTimeout(() => {
      if (usuario === 'admin' && contrasena === '123') {
        localStorage.setItem('user', JSON.stringify({ username: 'admin', name: 'Administrador' }))
        navigate('/dashboard')
      } else {
        setError('Usuario o contraseña incorrectos')
      }
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold">ChargeGO Admin</div>
          <div className="text-gray-500 text-sm">Acceso a panel de administración</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Usuario</label>
            <input
              autoFocus
              value={usuario}
              onChange={(e)=>setUsuario(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e)=>setContrasena(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="••••••"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Usuario de prueba: <span className="font-medium">admin</span> / Contraseña: <span className="font-medium">123</span>
        </div>
      </div>
    </div>
  )
}


