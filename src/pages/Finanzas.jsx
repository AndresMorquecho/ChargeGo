import { useMemo, useState } from 'react'
import Card from '../components/Card.jsx'
import Table from '../components/Table.jsx'
import { finanzas, transacciones, estacionesNombres } from '../data/mockData.js'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function Finanzas() {
  // Filtros
  const [preset, setPreset] = useState('mes')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [estacion, setEstacion] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [usuario, setUsuario] = useState('')

  const rangoFechas = useMemo(() => {
    const parse = (s) => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d) }
    let start, end
    const today = new Date()
    if (desde && hasta) { start = parse(desde); end = parse(hasta) }
    else {
      if (preset === 'dia') { start = new Date(today); end = new Date(today) }
      else if (preset === 'semana') { end = new Date(today); start = new Date(today); start.setDate(start.getDate()-6) }
      else if (preset === 'anio') { end = new Date(today); start = new Date(today); start.setMonth(start.getMonth()-11) }
      else { end = new Date(today); start = new Date(today); start.setDate(start.getDate()-29) }
    }
    start.setHours(0,0,0,0)
    end.setHours(23,59,59,999)
    return { start, end }
  }, [preset, desde, hasta])

  const filteredTx = useMemo(() => {
    return transacciones.filter((t) => {
      const f = new Date(t.fecha)
      const inRange = f >= rangoFechas.start && f <= rangoFechas.end
      const matchEstacion = estacion === 'Todas' ? true : (t.estacionInicio === estacion || t.estacionFin === estacion)
      const matchTipo = tipo === 'Todos' ? true : t.tipo === tipo
      const matchUsuario = usuario === '' ? true : t.usuario.toLowerCase().includes(usuario.toLowerCase())
      return inRange && matchEstacion && matchTipo && matchUsuario
    })
  }, [rangoFechas, estacion, tipo, usuario])

  // KPIs
  const ingresosTotales = useMemo(() => filteredTx.reduce((s, t) => s + (t.monto || 0), 0), [filteredTx])
  const estacionesActivas = 3 // mock
  const ingresosMesActual = ingresosTotales
  const ingresosAnio = ingresosTotales * 8 // mock simple
  const totalRentas = filteredTx.filter(t => t.tipo === 'renta_finalizada' || t.tipo === 'renta_activa').length
  const rentasPendientesPago = filteredTx.filter(t => t.estadoPago === 'pendiente').length
  const promedioPorEstacion = estacionesActivas ? ingresosTotales / estacionesActivas : 0

  // Series para gráficos
  const ingresosPorEstacion = useMemo(() => {
    const map = new Map()
    filteredTx.forEach((t) => {
      const key = t.estacionFin || t.estacionInicio || 'N/A'
      map.set(key, (map.get(key) || 0) + t.monto)
    })
    return Array.from(map.entries()).map(([estacion, monto]) => ({ estacion, monto }))
  }, [filteredTx])

  const ingresosPorDia = useMemo(() => {
    const map = new Map()
    filteredTx.forEach((t) => {
      const d = new Date(t.fecha)
      const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
      map.set(key, (map.get(key) || 0) + t.monto)
    })
    // meta proyectada (mock): +10% acumulado
    let acumulado = 0
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([fecha, monto])=>{
      acumulado += monto
      return { fecha, ingresos: monto, meta: acumulado * 1.1 }
    })
  }, [filteredTx])

  const distribucionPorTipo = useMemo(() => {
    const map = new Map()
    filteredTx.forEach(t => map.set(t.tipo, (map.get(t.tipo)||0)+t.monto))
    return Array.from(map.entries()).map(([tipo, monto]) => ({ tipo, monto }))
  }, [filteredTx])

  const columnsResumen = useMemo(() => [
    { key: 'estacion', header: 'Estación' },
    { key: 'rentas', header: 'Rentas', render: (_, row) => row.rentas || 0 },
    { key: 'ingresos', header: 'Ingresos', render: (v, row) => `$ ${row.ingresos.toFixed(2)}` },
    { key: 'promedio', header: 'Promedio por renta', render: (_, row) => `$ ${row.promedio.toFixed(2)}` },
    { key: 'porcentaje', header: '% del total', render: (_, row) => `${row.porcentaje.toFixed(1)}%` },
  ], [])

  const dataResumen = useMemo(() => {
    const byStation = new Map()
    filteredTx.forEach((t)=>{
      const st = t.estacionFin || t.estacionInicio || 'N/A'
      const cur = byStation.get(st) || { ingresos:0, rentas:0 }
      cur.ingresos += t.monto
      if (t.tipo === 'renta_finalizada' || t.tipo==='renta_activa') cur.rentas += 1
      byStation.set(st, cur)
    })
    return Array.from(byStation.entries()).map(([estacion, v]) => ({
      estacion,
      ingresos: v.ingresos,
      rentas: v.rentas,
      promedio: v.rentas ? v.ingresos / v.rentas : 0,
      porcentaje: ingresosTotales ? (v.ingresos / ingresosTotales) * 100 : 0,
    }))
  }, [filteredTx, ingresosTotales])

  

  const exportCSV = () => {
    const headers = ['Fecha','Usuario','Estación Inicio','Estación Fin','Tipo','Monto','Estado Pago']
    const rows = filteredTx.map(t => [
      new Date(t.fecha).toISOString(), t.usuario, t.estacionInicio || '', t.estacionFin || '', t.tipo, t.monto, t.estadoPago
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finanzas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const PIE_COLORS = ['#2563eb','#16a34a','#f59e0b','#ef4444','#7c3aed']

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Finanzas</h1>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1.5 rounded-md border ${preset==='dia'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('dia'); setDesde(''); setHasta('') }}>Día</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='semana'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('semana'); setDesde(''); setHasta('') }}>Semana</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='mes'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('mes'); setDesde(''); setHasta('') }}>Mes</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='anio'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('anio'); setDesde(''); setHasta('') }}>Año</button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500">Desde</label>
              <input type="date" value={desde} onChange={(e)=>{setDesde(e.target.value); setPreset('')}} className="border rounded-md px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Hasta</label>
              <input type="date" value={hasta} onChange={(e)=>{setHasta(e.target.value); setPreset('')}} className="border rounded-md px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Estación</label>
              <select value={estacion} onChange={(e)=>setEstacion(e.target.value)} className="border rounded-md px-2 py-1">
                <option>Todas</option>
                {estacionesNombres.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Tipo</label>
              <select value={tipo} onChange={(e)=>setTipo(e.target.value)} className="border rounded-md px-2 py-1">
                <option>Todos</option>
                <option value="renta_finalizada">Rentas finalizadas</option>
                <option value="renta_activa">Rentas activas</option>
                <option value="penalizacion">Penalizaciones</option>
                <option value="otros">Otros ingresos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Usuario</label>
              <input placeholder="Buscar usuario" value={usuario} onChange={(e)=>setUsuario(e.target.value)} className="border rounded-md px-2 py-1" />
            </div>
            <button onClick={exportCSV} className="px-3 py-1.5 rounded-md bg-gray-900 text-white">Exportar CSV</button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card title="Ingresos totales" value={`$ ${ingresosTotales.toLocaleString(undefined,{maximumFractionDigits:2})}`} />
        <Card title="Promedio mensual" value={`$ ${(ingresosTotales/ (preset==='anio'?12: (preset==='mes'?1: (preset==='semana'?0.25:0.03)))).toLocaleString(undefined,{maximumFractionDigits:2})}`} />
        <Card title="Estaciones activas" value={estacionesActivas} />
        <Card title="Ingresos mes actual" value={`$ ${ingresosMesActual.toLocaleString(undefined,{maximumFractionDigits:2})}`} />
        <Card title="Ingresos del año" value={`$ ${ingresosAnio.toLocaleString(undefined,{maximumFractionDigits:2})}`} />
        <Card title="Total de rentas" value={totalRentas} />
        <Card title="Rentas pendientes de pago" value={rentasPendientesPago} />
        <Card title="Promedio por estación" value={`$ ${promedioPorEstacion.toFixed(2)}`} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Ingresos por estación">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosPorEstacion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estacion" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monto" name="Ingresos" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Ingresos vs Meta">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingresosPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#2563eb" name="Ingresos" />
                <Line type="monotone" dataKey="meta" stroke="#f59e0b" name="Meta" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Distribución por tipo">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribucionPorTipo} dataKey="monto" nameKey="tipo" outerRadius={100} label>
                  {distribucionPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabla resumen */}
      <Card title="Resumen por estación">
        <Table columns={columnsResumen} data={dataResumen} />
      </Card>

      
    </div>
  )
}


