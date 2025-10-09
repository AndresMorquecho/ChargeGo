import { NavLink } from 'react-router-dom'
import logo from '../imagen/Logo.jpg'

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
    isActive ? 'bg-[var(--btn)] text-[var(--btn-text)]' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function Sidebar({ onClose }) {
  return (
    <aside className="w-64 p-4 sticky top-0 h-screen bg-white border-r border-[var(--border)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-white border border-[var(--border)]">
            <img src={logo} alt="ChargeGO" className="h-full w-full object-cover" />
          </div>
          <span>ChargeGO</span>
        </div>
        {/* Botón cerrar para móvil */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={navItemClass} onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/estaciones" className={navItemClass} onClick={onClose}>Estaciones</NavLink>
        <NavLink to="/rentas" className={navItemClass} onClick={onClose}>Rentas</NavLink>
        <NavLink to="/usuarios" className={navItemClass} onClick={onClose}>Usuarios</NavLink>
        <NavLink to="/finanzas" className={navItemClass} onClick={onClose}>Finanzas</NavLink>
        <NavLink to="/promociones" className={navItemClass} onClick={onClose}>Promociones</NavLink>
      </nav>
    </aside>
  )
}


