import { useMemo, useState } from 'react'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Toggle from '../components/Toggle.jsx'
import { usuarios, rentas } from '../data/mockData.js'

export default function Usuarios() {
  const [query, setQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [rentasActivasFilter, setRentasActivasFilter] = useState(false)

  const filtered = useMemo(() => {
    return usuarios.filter((u) => {
      const matchesQuery = query === '' ? true : 
        u.nombre.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        u.telefono.includes(query)
      const matchesEstado = estadoFilter === 'Todos' ? true : u.estado === estadoFilter
      const matchesRentasActivas = !rentasActivasFilter || u.rentasActivas > 0
      return matchesQuery && matchesEstado && matchesRentasActivas
    })
  }, [query, estadoFilter, rentasActivasFilter])

  const onToggleEstado = (usuario) => {
    usuario.estado = usuario.estado === 'activo' ? 'bloqueado' : 'activo'
    forceRerender()
  }

  const onEliminar = (usuario) => {
    if (confirm(`¿Eliminar usuario "${usuario.nombre}"?`)) {
      const idx = usuarios.findIndex((u) => u.id === usuario.id)
      if (idx > -1) usuarios.splice(idx, 1)
      forceRerender()
    }
  }

  const [tick, setTick] = useState(0)
  const forceRerender = () => setTick((t) => t + 1)

  const columns = useMemo(() => [
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'telefono', header: 'Teléfono' },
    { 
      key: 'fechaRegistro', 
      header: 'Fecha Registro', 
      render: (v) => new Date(v).toLocaleDateString('es-EC')
    },
    { 
      key: 'ultimaRenta', 
      header: 'Última Renta', 
      render: (_, row) => {
        const userRentas = rentas.filter(r => r.usuario === row.nombre)
        if (userRentas.length === 0) return 'N/A'
        const ultima = userRentas.sort((a, b) => new Date(b.horaInicio) - new Date(a.horaInicio))[0]
        return new Date(ultima.horaInicio).toLocaleDateString('es-EC')
      }
    },
    { key: 'rentas', header: 'Total Rentas' },
    { 
      key: 'rentasActivas', 
      header: 'Activas', 
      render: (v) => v > 0 ? <span className="text-blue-600 font-medium">{v}</span> : v
    },
    { 
      key: 'montoTotal', 
      header: 'Monto Total', 
      render: (v) => `$ ${v.toFixed(2)}`
    },
    { 
      key: 'estado', 
      header: 'Estado', 
      render: (v) => (
        <span className={`px-2 py-0.5 text-xs rounded ${
          v === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {v === 'activo' ? 'Activo' : 'Bloqueado'}
        </span>
      )
    },
    { 
      key: 'acciones', 
      header: 'Acciones', 
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <VerDetalleUsuario usuario={row} />
          <button className="px-2 py-1 text-xs rounded-md border hover:bg-gray-50" onClick={() => onToggleEstado(row)}>
            {row.estado === 'activo' ? 'Bloquear' : 'Desbloquear'}
          </button>
          <button className="px-2 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50" onClick={() => onEliminar(row)}>
            Eliminar
          </button>
        </div>
      )
    },
  ], [tick])

  const getRowClassName = (row) => {
    if (row.estado === 'bloqueado') return 'bg-red-50 hover:bg-red-100'
    if (row.rentasActivas > 0) return 'bg-blue-50 hover:bg-blue-100'
    return 'hover:bg-gray-50'
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Usuarios</h1>
      
      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Buscar</label>
            <input 
              placeholder="Nombre, email o teléfono" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="w-full border rounded-md px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option value="Todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={rentasActivasFilter} 
                onChange={(e) => setRentasActivasFilter(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Solo con rentas activas</span>
            </label>
          </div>
        </div>
      </div>

      <Table columns={columns} data={filtered} rowClassName={getRowClassName} />
    </div>
  )
}

function VerDetalleUsuario({ usuario }) {
  const [open, setOpen] = useState(false)
  const userRentas = rentas.filter(r => r.usuario === usuario.nombre)

  return (
    <>
      <button className="px-2 py-1 text-xs rounded-md border hover:bg-gray-50" onClick={() => setOpen(true)}>
        Ver detalle
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Detalle de Usuario: ${usuario.nombre}`}>
        <div className="space-y-4">
          {/* Info básica */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Email:</span> {usuario.email}</div>
            <div><span className="font-medium">Teléfono:</span> {usuario.telefono}</div>
            <div><span className="font-medium">Fecha Registro:</span> {new Date(usuario.fechaRegistro).toLocaleDateString('es-EC')}</div>
            <div><span className="font-medium">Estado:</span> 
              <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                usuario.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {usuario.estado === 'activo' ? 'Activo' : 'Bloqueado'}
              </span>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Estadísticas de Rentas</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500">Total Rentas</div>
                <div className="text-lg font-semibold">{usuario.rentas}</div>
              </div>
              <div className="bg-blue-50 rounded p-3">
                <div className="text-xs text-gray-500">Activas</div>
                <div className="text-lg font-semibold text-blue-600">{usuario.rentasActivas}</div>
              </div>
              <div className="bg-green-50 rounded p-3">
                <div className="text-xs text-gray-500">Monto Total</div>
                <div className="text-lg font-semibold text-green-600">$ {usuario.montoTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Historial de rentas */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Historial de Rentas</h4>
            {userRentas.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay rentas registradas</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userRentas.slice(0, 10).map((renta) => (
                  <div key={renta.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <div>
                      <span className="font-medium">#{renta.id}</span> - {renta.estacionInicio} → {renta.estacionFin || 'En uso'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        renta.estado === 'activa' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {renta.estado === 'activa' ? 'Activa' : 'Devuelta'}
                      </span>
                      <span className="text-gray-600">
                        {renta.estado === 'activa' ? 'En curso' : `$ ${renta.monto.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                ))}
                {userRentas.length > 10 && (
                  <p className="text-xs text-gray-500 text-center">... y {userRentas.length - 10} más</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}


