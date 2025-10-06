import { useMemo, useState } from 'react'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Toggle from '../components/Toggle.jsx'
import { estaciones as estacionesData } from '../data/mockData.js'

export default function Estaciones() {
  const [query, setQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState(null) // objeto estación o null

  const onCreate = () => { setEditing(null); setOpenModal(true) }
  const onEdit = (row) => { setEditing(row); setOpenModal(true) }
  const onDelete = (row) => {
    if (confirm(`¿Eliminar estación "${row.nombre}"?`)) {
      const idx = estacionesData.findIndex((e) => e.id === row.id)
      if (idx > -1) estacionesData.splice(idx, 1)
      forceRerender()
    }
  }

  const onToggleEstado = (row, checked) => {
    row.estado = checked ? 'activo' : 'inactivo'
    forceRerender()
  }

  const [tick, setTick] = useState(0)
  const forceRerender = () => setTick((t) => t + 1)

  const filtered = useMemo(() => {
    return estacionesData.filter((e) => {
      const matchesQuery = `${e.nombre} ${e.localidad}`.toLowerCase().includes(query.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' ? true : e.estado === estadoFilter
      return matchesQuery && matchesEstado
    })
  }, [query, estadoFilter, tick])

  const columns = useMemo(() => {
    return [
      {
        key: 'nombre', header: 'Nombre', render: (v, row) => (
          <div>
            <div className="font-medium">{row.nombre}</div>
            <div className="text-xs text-gray-500">{row.localidad} · <span title={row.direccion}>{row.direccion}</span></div>
          </div>
        )
      },
      {
        key: 'capacidad', header: 'Capacidad', render: (v, row) => (
          <span className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 border border-blue-100">{row.capacidad}</span>
        )
      },
      {
        key: 'ocupacion', header: 'Ocupación', render: (_, row) => {
          const disponibles = Math.max(row.capacidad - row.enUso - row.danados, 0)
          const usedPct = Math.round((row.enUso / row.capacidad) * 100)
          const dmgPct = Math.round((row.danados / row.capacidad) * 100)
          const freePct = Math.max(100 - usedPct - dmgPct, 0)
          return (
            <div className="min-w-[180px]">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>En uso: {row.enUso}</span>
                <span>Disp: {disponibles}</span>
                <span>Daños: {row.danados}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded overflow-hidden flex">
                <div style={{ width: `${usedPct}%` }} className="bg-blue-500" />
                <div style={{ width: `${dmgPct}%` }} className="bg-amber-500" />
                <div style={{ width: `${freePct}%` }} className="bg-green-500" />
              </div>
            </div>
          )
        }
      },
      { key: 'rentasMes', header: 'Rentas (mes)' },
      { key: 'ingresos', header: 'Ingresos', render: (v) => `$ ${v.toLocaleString()}` },
      {
        key: 'estadoLinea', header: 'Estado', render: (_, row) => (
          <span className={`px-2 py-0.5 text-xs rounded ${row.offline ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {row.offline ? 'offline' : 'online'}
          </span>
        )
      },
      {
        key: 'estado', header: 'Habilitado', render: (v, row) => (
          <div className="flex items-center gap-2">
            <Toggle checked={row.estado === 'activo'} onChange={(checked) => onToggleEstado(row, checked)} />
            <span className={`px-2 py-0.5 text-xs rounded ${v === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v}</span>
          </div>
        )
      },
      {
        key: 'acciones', header: 'Acciones', render: (_, row) => (
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-sm rounded-md btn-primary" onClick={() => onEdit(row)}>Editar</button>
            <button className="px-2 py-1 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50" onClick={() => onDelete(row)}>Eliminar</button>
            <VerDetalle row={row} />
          </div>
        )
      },
    ]
  }, [tick])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Estaciones</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Buscar por nombre o localidad" value={query} onChange={(e)=>setQuery(e.target.value)} className="border rounded-md px-3 py-2 min-w-64" />
          <select value={estadoFilter} onChange={(e)=>setEstadoFilter(e.target.value)} className="border rounded-md px-3 py-2">
            <option>Todos</option>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <button className="px-3 py-2 rounded-md btn-primary" onClick={onCreate}>+ Nueva Estación</button>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowClassName={(row) => row.offline ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? 'Editar Estación' : 'Nueva Estación'}>
        <EstacionForm
          initial={editing || { nombre: '', localidad: '', direccion: '', capacidad: 1, estado: 'activo', offline: false }}
          onSave={(data) => {
            if (editing) {
              Object.assign(editing, data)
            } else {
              estacionesData.push({ id: Date.now(), ...data })
            }
            setOpenModal(false)
            forceRerender()
          }}
        />
      </Modal>
    </div>
  )
}

function EstacionForm({ initial, onSave }) {
  const [form, setForm] = useState(initial)
  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'number' ? Number(value) : (type === 'checkbox' ? checked : value) }))
  }
  return (
    <form
      onSubmit={(e)=>{ e.preventDefault(); onSave(form) }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Localidad</label>
        <input name="localidad" value={form.localidad} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600 mb-1">Dirección</label>
        <input name="direccion" value={form.direccion} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Capacidad</label>
        <input type="number" name="capacidad" min={1} value={form.capacidad} onChange={onChange} className="w-full border rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Estado</label>
        <select name="estado" value={form.estado} onChange={onChange} className="w-full border rounded-md px-3 py-2">
          <option value="activo">activo</option>
          <option value="inactivo">inactivo</option>
        </select>
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <input id="offline" type="checkbox" name="offline" checked={!!form.offline} onChange={onChange} />
        <label htmlFor="offline" className="text-sm text-gray-700">Marcar como offline</label>
      </div>
      <div className="md:col-span-2 flex gap-3">
        <button type="submit" className="px-4 py-2 rounded-md btn-primary">Guardar</button>
        <button type="button" className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={()=>onSave(initial)}>Cancelar</button>
      </div>
    </form>
  )
}

function VerDetalle({ row }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="px-2 py-1 text-sm rounded-md border hover:bg-gray-50" onClick={() => setOpen(true)}>Ver detalle</button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Detalle · ${row.nombre}`}>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Localidad:</span> {row.localidad}</div>
          <div><span className="font-medium">Dirección:</span> {row.direccion}</div>
          <div><span className="font-medium">Capacidad:</span> {row.capacidad}</div>
          <div className="flex items-center gap-2"><span className="font-medium">Estado online:</span> <span className={`px-2 py-0.5 text-xs rounded ${row.offline ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{row.offline ? 'offline' : 'online'}</span></div>
          <div className="h-px bg-gray-200 my-3" />
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded p-2"><div className="text-xs text-gray-500">En uso</div><div className="text-lg font-semibold">{row.enUso}</div></div>
            <div className="bg-gray-50 rounded p-2"><div className="text-xs text-gray-500">Disponibles</div><div className="text-lg font-semibold">{Math.max(row.capacidad - row.enUso - row.danados, 0)}</div></div>
            <div className="bg-gray-50 rounded p-2"><div className="text-xs text-gray-500">Dañados</div><div className="text-lg font-semibold">{row.danados}</div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded p-2"><div className="text-xs text-gray-500">Rentas (mes)</div><div className="text-lg font-semibold">{row.rentasMes}</div></div>
            <div className="bg-gray-50 rounded p-2"><div className="text-xs text-gray-500">Ingresos</div><div className="text-lg font-semibold">$ {row.ingresos.toLocaleString()}</div></div>
          </div>
        </div>
      </Modal>
    </>
  )
}


