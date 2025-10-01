import { NavLink } from 'react-router-dom'

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block sticky top-0 h-screen">
      <div className="text-2xl font-bold mb-6">ChargeGO</div>
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


