import Card from '../components/Card.jsx'
import Accordion from '../components/Accordion.jsx'
import { finanzas, seriesPorEstacion, estacionesNombres, alertas } from '../data/mockData.js'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'
import { useMemo, useState } from 'react'

export default function Dashboard() {
  // KPIs mock
  const totalEstaciones = 15
  const estacionesActivas = 12
  const totalCargadores = 300
  const cargadoresEnUso = 120
  const { mesActual, mesAnterior } = finanzas.resumenMensual
  const variacionIngresos = ((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos) * 100

  const tendenciaColor = variacionIngresos >= 0 ? 'text-green-600' : 'text-red-600'
  const tendenciaIcono = variacionIngresos >= 0 ? '▲' : '▼'

  // Filtros
  const [preset, setPreset] = useState('mes') // 'dia' | 'semana' | 'mes' | 'anio'
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [estacion, setEstacion] = useState('Todas')

  const rangoFechas = useMemo(() => {
    const parse = (s) => {
      const [y, m, d] = s.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    let start, end
    const today = new Date()
    if (desde && hasta) {
      start = parse(desde)
      end = parse(hasta)
    } else {
      if (preset === 'dia') {
        start = new Date(today)
        end = new Date(today)
      } else if (preset === 'semana') {
        end = new Date(today)
        start = new Date(today)
        start.setDate(start.getDate() - 6)
      } else if (preset === 'anio') {
        end = new Date(today)
        start = new Date(today)
        start.setMonth(start.getMonth() - 11)
      } else { // mes
        end = new Date(today)
        start = new Date(today)
        start.setDate(start.getDate() - 29)
      }
    }
    // normalizar horas
    start.setHours(0,0,0,0)
    end.setHours(23,59,59,999)
    return { start, end }
  }, [preset, desde, hasta])

  const lineaData = useMemo(() => {
    // fuente base: serie general o por estación
    const base = estacion === 'Todas' ? finanzas.rentasPorDia : seriesPorEstacion[estacion] || []
    // filtrar por rango de fechas (las etiquetas son dd/MM, comparamos parseando)
    const inRange = base.filter((p) => {
      const [dd, mm] = p.fecha.split('/')
      const date = new Date(new Date().getFullYear(), Number(mm) - 1, Number(dd))
      return date >= rangoFechas.start && date <= rangoFechas.end
    })
    return inRange
  }, [estacion, rangoFechas])

  const top5 = useMemo(() => finanzas.topEstacionesMes, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Estaciones activas">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold">{estacionesActivas}</div>
              <div className="text-sm text-gray-500">de {totalEstaciones}</div>
            </div>
            <div className="text-sm text-gray-600">{Math.round((estacionesActivas/totalEstaciones)*100)}%</div>
          </div>
        </Card>
        <Card title="Cargadores en uso">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold">{cargadoresEnUso}</div>
              <div className="text-sm text-gray-500">de {totalCargadores}</div>
            </div>
            <div className="text-sm text-gray-600">{Math.round((cargadoresEnUso/totalCargadores)*100)}%</div>
          </div>
        </Card>
        <Card title="Ingresos del mes">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold">$ {mesActual.ingresos.toLocaleString()}</div>
              <div className={`text-sm ${tendenciaColor}`}>{tendenciaIcono} {Math.abs(variacionIngresos).toFixed(1)}% vs mes pasado</div>
            </div>
          </div>
        </Card>
        <Card title="Total de rentas (mes)">
          <div className="text-3xl font-semibold">{mesActual.rentas}</div>
          <div className="text-sm text-gray-500">vs {mesAnterior.rentas} el mes pasado</div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1.5 rounded-md border ${preset==='dia'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('dia'); setDesde(''); setHasta('') }}>Día</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='semana'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('semana'); setDesde(''); setHasta('') }}>Semana</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='mes'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('mes'); setDesde(''); setHasta('') }}>Mes</button>
            <button className={`px-3 py-1.5 rounded-md border ${preset==='anio'?'bg-blue-600 text-white border-blue-600':'bg-white'}`} onClick={() => { setPreset('anio'); setDesde(''); setHasta('') }}>Año</button>
          </div>
          <div className="flex items-center gap-2">
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
                {estacionesNombres.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Línea: Rentas e Ingresos (dinámico) */}
      <Card title="Rentas e Ingresos (según filtros)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="rentas" stroke="#2563eb" strokeWidth={2} name="Rentas" />
              <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#16a34a" strokeWidth={2} name="Ingresos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top 5 estaciones (barras horizontales) y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Top 5 estaciones por rentas (mes)">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top5} layout="vertical" margin={{ left: 80, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="estacion" width={160} />
                  <Tooltip />
                  <Bar dataKey="rentas" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Alertas">
            <Accordion
              items={[
                {
                  icon: '⚠️',
                  title: `Estaciones offline (${alertas.estacionesOffline.length})`,
                  content: () => (
                    <ul className="list-disc pl-5 py-2 space-y-1">
                      {alertas.estacionesOffline.map((s) => (
                        <li key={s.id}>{s.id} · {s.nombre}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  icon: '🛠️',
                  title: `Cargadores dañados (${alertas.cargadoresDanados.length})`,
                  content: () => (
                    <ul className="list-disc pl-5 py-2 space-y-1">
                      {alertas.cargadoresDanados.map((c) => (
                        <li key={c.id}>{c.id} · {c.estacion}</li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}


