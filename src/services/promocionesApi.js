const KEY = 'promociones'

const seed = [
  { id: 1, nombre: 'Lanzamiento Verde', tipo: 'descuento_porcentual', porcentaje: 10, inicio: '2025-10-01', fin: '2025-10-31', estado: 'activa', aplicaA: 'todos', usosMax: 1, usosRealizados: 0, bateriasPorUso: 1, porDia: 1 },
  { id: 2, nombre: 'Cliente Premium', tipo: 'descuento_fijo', monto: 2.5, inicio: '2025-10-05', fin: '2025-11-05', estado: 'activa', aplicaA: 'cliente', cliente: 'Ana López', usosMax: 2, usosRealizados: 1, bateriasPorUso: 1 },
]

function readAll() {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return [...seed]
  }
  try { return JSON.parse(raw) || [] } catch { return [] }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function listarPromociones() {
  return readAll()
}

export function crearPromocion(promo) {
  const list = readAll()
  const id = Date.now()
  list.push({ id, ...promo })
  writeAll(list)
  return id
}

export function actualizarPromocion(id, cambios) {
  const list = readAll()
  const idx = list.findIndex(p => p.id === id)
  if (idx > -1) {
    list[idx] = { ...list[idx], ...cambios }
    writeAll(list)
    return true
  }
  return false
}

export function eliminarPromocion(id) {
  const list = readAll().filter(p => p.id !== id)
  writeAll(list)
}

export function promocionesActivas(fecha = new Date()) {
  const f = new Date(fecha)
  return readAll().filter(p => p.estado === 'activa' && new Date(p.inicio) <= f && new Date(p.fin) >= f)
}


