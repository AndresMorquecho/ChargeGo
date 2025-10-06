import { NavLink } from 'react-router-dom'
import logo from '../imagen/Logo.jpg'

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
    isActive ? 'bg-[var(--btn)] text-[var(--btn-text)]' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 hidden md:block sticky top-0 h-screen" style={{background:'#FFFFFF', borderRight:'1px solid var(--border)'}}>
      <div className="flex items-center gap-2 text-2xl font-bold mb-6">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-white border border-[var(--border)]">
          <img src={logo} alt="ChargeGO" className="h-full w-full object-cover" />
        </div>
        <span>ChargeGO</span>
      </div>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={navItemClass}>Dashboard</NavLink>
        <NavLink to="/estaciones" className={navItemClass}>Estaciones</NavLink>
        <NavLink to="/rentas" className={navItemClass}>Rentas</NavLink>
        <NavLink to="/usuarios" className={navItemClass}>Usuarios</NavLink>
        <NavLink to="/finanzas" className={navItemClass}>Finanzas</NavLink>
      </nav>
    </aside>
  )
}


