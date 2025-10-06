import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../imagen/Logo.jpg'

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
      <div className="w-full max-w-sm card p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-white flex items-center justify-center mb-3 overflow-hidden">
            <img src={logo} alt="ChargeGO" className="h-12 w-12 object-cover" />
          </div>
          <div className="text-2xl font-semibold">ChargeGO Admin</div>
          <div className="opacity-80 text-sm">Acceso a panel de administración</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Usuario o correo electrónico</label>
            <input
              autoFocus
              value={usuario}
              onChange={(e)=>setUsuario(e.target.value)}
              className="w-full input px-3 py-2 focus:outline-none"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e)=>setContrasena(e.target.value)}
              className="w-full input px-3 py-2 focus:outline-none"
              placeholder="••••••"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full px-4 py-2 btn-primary disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="mt-4 text-xs opacity-80 text-center">
          Usuario de prueba: <span className="font-medium">admin</span> / Contraseña: <span className="font-medium">123</span>
        </div>
      </div>
    </div>
  )
}


