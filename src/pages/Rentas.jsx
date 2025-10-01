import { useMemo, useState } from 'react'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import { rentas, estacionesNombres, usuarios } from '../data/mockData.js'

export default function Rentas() {
  const [estadoFilter, setEstadoFilter] = useState('Todas')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [estacionFilter, setEstacionFilter] = useState('Todas')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return rentas.filter((r) => {
      const matchesEstado = estadoFilter === 'Todas' ? true : r.estado === estadoFilter
      const matchesEstacion = estacionFilter === 'Todas' ? true : 
        r.estacionInicio === estacionFilter || r.estacionFin === estacionFilter
      const matchesQuery = query === '' ? true : 
        r.usuario.toLowerCase().includes(query.toLowerCase()) || 
        r.id.toString().includes(query)
      
      let matchesFecha = true
      if (fechaDesde || fechaHasta) {
        const fechaInicio = new Date(r.horaInicio)
        if (fechaDesde) {
          const desde = new Date(fechaDesde)
          desde.setHours(0, 0, 0, 0)
          matchesFecha = matchesFecha && fechaInicio >= desde
        }
        if (fechaHasta) {
          const hasta = new Date(fechaHasta)
          hasta.setHours(23, 59, 59, 999)
          matchesFecha = matchesFecha && fechaInicio <= hasta
        }
      }
      
      return matchesEstado && matchesEstacion && matchesQuery && matchesFecha
    })
  }, [estadoFilter, estacionFilter, query, fechaDesde, fechaHasta])

  const calcularDuracion = (renta) => {
    const inicio = new Date(renta.horaInicio)
    const fin = renta.horaFin ? new Date(renta.horaFin) : new Date()
    const diffMs = fin - inicio
    const diffMin = Math.floor(diffMs / (1000 * 60))
    // Asegurar mínimo 1 minuto para evitar 0/negativos por redondeo o desajustes horarios
    return Math.max(diffMin, 1)
  }

  // Tarifa: $1 por cada 30 minutos, tope $5 por día (cada bloque de 24h)
  const calcularMonto = (renta) => {
    const minutos = calcularDuracion(renta)
    const bloques30 = Math.ceil(minutos / 30)
    const costoPorBloques = bloques30 * 1
    const dias = Math.ceil(minutos / (24 * 60)) || 1
    const tope = dias * 5
    return Math.min(costoPorBloques, tope)
  }

  const duracionPromedio = useMemo(() => {
    const devueltas = rentas.filter(r => r.estado === 'devuelta')
    if (devueltas.length === 0) return 60
    const total = devueltas.reduce((sum, r) => sum + calcularDuracion(r), 0)
    return Math.round(total / devueltas.length)
  }, [])

  const columns = useMemo(() => [
    { key: 'usuario', header: 'Usuario' },
    { key: 'estacionInicio', header: 'Estación Inicio' },
    { key: 'estacionFin', header: 'Estación Fin', render: (v) => v || 'En uso' },
    { 
      key: 'horaInicio', 
      header: 'Hora Inicio', 
      render: (v) => new Date(v).toLocaleString('es-EC', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    { 
      key: 'horaFin', 
      header: 'Hora Fin', 
      render: (v) => v ? new Date(v).toLocaleString('es-EC', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : 'En curso'
    },
    { 
      key: 'duracion', 
      header: 'Tiempo de Renta', 
      render: (_, row) => {
        const duracion = calcularDuracion(row)
        const excedePromedio = duracion > duracionPromedio * 1.2
        return (
          <span className={excedePromedio ? 'text-amber-600 font-medium' : ''}>
            {duracion} min
            {excedePromedio && ' ⚠️'}
          </span>
        )
      }
    },
    { 
      key: 'monto', 
      header: 'Monto', 
      render: (_, row) => row.estado === 'activa' ? `Est. $ ${calcularMonto(row).toFixed(2)}` : `$ ${calcularMonto(row).toFixed(2)}`
    },
    { 
      key: 'estado', 
      header: 'Estado', 
      render: (v) => (
        <span className={`px-2 py-0.5 text-xs rounded ${
          v === 'activa' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          {v === 'activa' ? 'Activa' : 'Devuelta'}
        </span>
      )
    },
    { 
      key: 'acciones', 
      header: 'Acciones', 
      render: (_, row) => <VerDetalleRenta renta={row} />
    },
  ], [duracionPromedio])

  const getRowClassName = (row) => {
    if (row.estado === 'activa') return 'bg-blue-50 hover:bg-blue-100'
    if (row.estado === 'devuelta') return 'bg-green-50 hover:bg-green-100'
    return 'hover:bg-gray-50'
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Rentas</h1>
      
      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option value="Todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="devuelta">Devueltas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estación</label>
            <select value={estacionFilter} onChange={(e) => setEstacionFilter(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option value="Todas">Todas</option>
              {estacionesNombres.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Buscar</label>
            <input placeholder="Usuario o ID" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>
      </div>

      <Table columns={columns} data={filtered} rowClassName={getRowClassName} />
    </div>
  )
}

function VerDetalleRenta({ renta }) {
  const [open, setOpen] = useState(false)
  const duracion = (() => {
    const inicio = new Date(renta.horaInicio)
    const fin = renta.horaFin ? new Date(renta.horaFin) : new Date()
    const diffMs = fin - inicio
    const diffMin = Math.floor(diffMs / (1000 * 60))
    return Math.max(diffMin, 1)
  })()

  return (
    <>
      <button className="px-2 py-1 text-sm rounded-md border hover:bg-gray-50" onClick={() => setOpen(true)}>
        Ver detalle
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Detalle de Renta #${renta.id}`}>
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Usuario:</span> {renta.usuario}</div>
          <div><span className="font-medium">Estación Inicio:</span> {renta.estacionInicio}</div>
          <div><span className="font-medium">Estación Fin:</span> {renta.estacionFin || 'En uso'}</div>
          <div><span className="font-medium">Hora Inicio:</span> {new Date(renta.horaInicio).toLocaleString('es-EC')}</div>
          <div><span className="font-medium">Hora Fin:</span> {renta.horaFin ? new Date(renta.horaFin).toLocaleString('es-EC') : 'En curso'}</div>
          <div><span className="font-medium">Duración:</span> {duracion} minutos</div>
          <div><span className="font-medium">Duración Estimada:</span> {renta.duracionEstimada} minutos</div>
          <div><span className="font-medium">Monto:</span> {renta.estado === 'activa' ? 'En curso' : `$ ${renta.monto.toFixed(2)}`}</div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Estado:</span>
            <span className={`px-2 py-0.5 text-xs rounded ${
              renta.estado === 'activa' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {renta.estado === 'activa' ? 'Activa' : 'Devuelta'}
            </span>
          </div>
        </div>
      </Modal>
    </>
  )
}


