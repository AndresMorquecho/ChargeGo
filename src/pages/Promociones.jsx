import { useMemo, useState } from 'react'
import Card from '../components/Card.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import { listarPromociones, crearPromocion, actualizarPromocion, eliminarPromocion } from '../services/promocionesApi.js'
import { usuarios as usuariosMock, estaciones as estacionesMock } from '../data/mockData.js'

export default function Promociones() {
  const [tick, setTick] = useState(0)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const recargar = () => setTick(t => t + 1)
  const data = useMemo(() => {
    return listarPromociones().filter(p => `${p.nombre} ${p.aplicaA || ''}`.toLowerCase().includes(busqueda.toLowerCase()))
  }, [tick, busqueda])

  const columns = useMemo(() => [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo', render: (v) => ({ bateria_gratis:'Batería gratuita', descuento_porcentual:'Descuento %', descuento_fijo:'Descuento fijo' }[v] || v) },
    { key: 'aplicaA', header: 'Ámbito', render: (v, row) => v === 'cliente' ? `Cliente: ${row.cliente}` : (v === 'estacion' ? `Estación: ${row.estacion}` : `Todos${row.porDia?` · ${row.porDia}/cliente/día`:''}`) },
    { key: 'bateriasPorUso', header: 'Baterías/uso', render: (v) => v ?? 1 },
    { key: 'usos', header: 'Usos', render: (_, row) => `${row.usosRealizados || 0}/${row.usosMax || '∞'}` },
    { key: 'inicio', header: 'Inicio' },
    { key: 'fin', header: 'Fin' },
    { key: 'porDia', header: 'Límite diario', render: (v) => v ? `${v}/día` : '—' },
    { key: 'estado', header: 'Estado', render: (v, row) => {
        const expirada = row.usosMax && (row.usosRealizados || 0) >= row.usosMax
        const etiqueta = expirada ? 'expirada' : v
        const cls = etiqueta==='activa' ? 'bg-green-100 text-green-700' : (etiqueta==='expirada' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')
        return <span className={`px-2 py-0.5 text-xs rounded ${cls}`}>{etiqueta}</span>
      }
    },
    { key: 'acciones', header: 'Acciones', render: (_, row) => (
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 text-sm rounded-md btn-primary" onClick={() => { setEditing(row); setOpen(true) }}>Editar</button>
        <button className="px-2 py-1 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50" onClick={() => { if (confirm('¿Eliminar promoción?')) { eliminarPromocion(row.id); recargar() } }}>Eliminar</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Promociones</h1>
        <div className="flex items-center gap-2">
          <input value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} placeholder="Buscar promoción" className="border rounded-md px-3 py-2" />
          <button className="px-3 py-2 rounded-md btn-primary" onClick={() => { setEditing(null); setOpen(true) }}>+ Nueva Promoción</button>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={data} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar Promoción' : 'Nueva Promoción'}>
        <PromocionForm
          initial={editing || { nombre:'', tipo:'descuento_porcentual', inicio:'', fin:'', estado:'activa', aplicaA:'todos', porcentaje:10, usosMax: 1, usosRealizados: 0, bateriasPorUso: 1, porDia: 1, aplicaSoloPrimera: false }}
          onSave={(values) => {
            if (editing) actualizarPromocion(editing.id, values)
            else crearPromocion(values)
            setOpen(false)
            recargar()
          }}
        />
      </Modal>
    </div>
  )
}

function PromocionForm({ initial, onSave }) {
  const [form, setForm] = useState(initial)
  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const onChangeNumber = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: Number(value) }))
  }
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSave(form) }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo</label>
        <select name="tipo" value={form.tipo} onChange={onChange} className="w-full border rounded-md px-3 py-2">
          <option value="bateria_gratis">Batería gratuita</option>
          <option value="descuento_porcentual">Descuento porcentual</option>
          <option value="descuento_fijo">Descuento fijo</option>
        </select>
      </div>
      {form.tipo === 'descuento_porcentual' && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Porcentaje %</label>
          <input type="number" name="porcentaje" min={1} max={100} value={form.porcentaje || 0} onChange={onChangeNumber} className="w-full border rounded-md px-3 py-2" />
        </div>
      )}
      {form.tipo === 'descuento_fijo' && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Monto fijo</label>
          <input type="number" step="0.01" name="monto" value={form.monto || 0} onChange={onChangeNumber} className="w-full border rounded-md px-3 py-2" />
        </div>
      )}
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600 mb-1">Baterías por uso</label>
        <input type="number" min={1} name="bateriasPorUso" value={form.bateriasPorUso || 1} onChange={onChangeNumber} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Usos máximos</label>
        <input type="number" min={0} name="usosMax" value={form.usosMax ?? 0} onChange={onChangeNumber} className="w-full border rounded-md px-3 py-2" />
        <div className="text-xs text-gray-500 mt-1">0 = ilimitado</div>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Aplicar solo a la primera toma</label>
        <select name="aplicaSoloPrimera" value={form.aplicaSoloPrimera ? 'si' : 'no'} onChange={(e)=>setForm(f=>({...f, aplicaSoloPrimera: e.target.value==='si'}))} className="w-full border rounded-md px-3 py-2">
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha inicio</label>
        <input type="date" name="inicio" value={form.inicio} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha fin</label>
        <input type="date" name="fin" value={form.fin} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Estado</label>
        <select name="estado" value={form.estado} onChange={onChange} className="w-full border rounded-md px-3 py-2">
          <option value="activa">activa</option>
          <option value="inactiva">inactiva</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Ámbito</label>
        <select name="aplicaA" value={form.aplicaA} onChange={onChange} className="w-full border rounded-md px-3 py-2">
          <option value="todos">Todos</option>
          <option value="cliente">Cliente</option>
          <option value="estacion">Estación</option>
        </select>
      </div>
      {form.aplicaA === 'cliente' && (
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Cliente</label>
          <ClienteSearch value={form.cliente || ''} onChange={(v)=>setForm(f=>({...f, cliente:v}))} />
          <ClienteDetails nombre={form.cliente} />
        </div>
      )}
      {form.aplicaA === 'estacion' && (
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Estación</label>
          <select
            name="estacion"
            value={form.estacion || ''}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Selecciona una estación</option>
            {estacionesMock.map((e) => (
              <option key={e.id} value={e.nombre}>{e.nombre}</option>
            ))}
          </select>
          <EstacionDetails nombre={form.estacion} />
        </div>
      )}
      <div className="md:col-span-2 flex gap-3">
        <button type="submit" className="px-4 py-2 rounded-md btn-primary">Guardar</button>
        <button type="button" className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={()=>onSave(initial)}>Cancelar</button>
      </div>
    </form>
  )
}

function ClienteSearch({ value, onChange }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  // lista simple de ejemplo (en real, podrías buscar en backend)
  const opciones = usuariosMock.map(u=>u.nombre)
    .filter(n => n.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5)
  return (
    <div className="relative">
      <input
        value={value}
        onFocus={()=>setOpen(true)}
        onChange={(e)=>{ onChange(e.target.value); setQ(e.target.value) }}
        placeholder="Buscar cliente"
        className="w-full border rounded-md px-3 py-2"
      />
      {open && opciones.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow">
          {opciones.map(opt => (
            <button key={opt} type="button" className="block w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ onChange(opt); setQ(''); setOpen(false) }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ClienteDetails({ nombre }) {
  if (!nombre) return null
  const u = usuariosMock.find(u => u.nombre === nombre)
  if (!u) return <div className="text-xs text-gray-500 mt-1">No se encontró información del cliente.</div>
  return (
    <div className="text-xs text-gray-600 mt-2">
      <div><span className="font-medium">Email:</span> {u.email}</div>
      <div><span className="font-medium">Teléfono:</span> {u.telefono}</div>
      <div><span className="font-medium">Cédula:</span> {u.cedula || '—'}</div>
    </div>
  )
}

function EstacionDetails({ nombre }) {
  if (!nombre) return null
  const e = estacionesMock.find(e => e.nombre === nombre)
  if (!e) return <div className="text-xs text-gray-500 mt-1">No se encontró información de la estación.</div>
  return (
    <div className="text-xs text-gray-600 mt-2">
      <div><span className="font-medium">Localidad:</span> {e.localidad}</div>
      <div><span className="font-medium">Dirección:</span> {e.direccion}</div>
      <div><span className="font-medium">Capacidad:</span> {e.capacidad}</div>
      <div><span className="font-medium">Estado:</span> {e.estado}</div>
    </div>
  )
}


