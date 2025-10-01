import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Estaciones from './pages/Estaciones.jsx'
import Rentas from './pages/Rentas.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Finanzas from './pages/Finanzas.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estaciones" element={<Estaciones />} />
        <Route path="/rentas" element={<Rentas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/finanzas" element={<Finanzas />} />
      </Route>
    </Routes>
  )
}


