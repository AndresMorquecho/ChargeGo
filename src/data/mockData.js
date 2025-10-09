export const estaciones = [
  {
    id: 1,
    nombre: 'Malecón 2000',
    localidad: 'Guayaquil',
    direccion: 'Av. 9 de Octubre y Malecón',
    capacidad: 40,
    enUso: 22,
    danados: 3,
    rentasMes: 420,
    ingresos: 28500,
    estado: 'activo',
    offline: false,
  },
  {
    id: 2,
    nombre: 'Quicentro Sur',
    localidad: 'Quito',
    direccion: 'Av. Maldonado y Amaru Ñan',
    capacidad: 35,
    enUso: 18,
    danados: 2,
    rentasMes: 365,
    ingresos: 25400,
    estado: 'activo',
    offline: false,
  },
  {
    id: 3,
    nombre: 'Mall del Sol',
    localidad: 'Guayaquil',
    direccion: 'Av. Juan Tanca Marengo',
    capacidad: 50,
    enUso: 28,
    danados: 5,
    rentasMes: 510,
    ingresos: 35800,
    estado: 'activo',
    offline: false,
  },
  {
    id: 4,
    nombre: 'Parque Samanes',
    localidad: 'Guayaquil',
    direccion: 'Av. Francisco de Orellana',
    capacidad: 30,
    enUso: 6,
    danados: 4,
    rentasMes: 190,
    ingresos: 11250,
    estado: 'inactivo',
    offline: true,
  },
]

export const estacionesNombres = ['Malecón 2000', 'Quicentro Sur', 'Mall del Sol', 'Parque Samanes']

export const usuarios = [
  {
    id: 1,
    nombre: 'Ana López',
    email: 'ana@example.com',
    telefono: '+593 99 123 4567',
    cedula: '0912345678',
    fechaRegistro: '2024-01-15',
    estado: 'activo',
    rentas: 5,
    rentasActivas: 1,
    rentasRetraso: 0,
    montoTotal: 45.50,
    estacionMasUsada: 'Malecón 2000'
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    email: 'carlos@example.com',
    telefono: '+593 98 765 4321',
    cedula: '1723456789',
    fechaRegistro: '2024-02-20',
    estado: 'activo',
    rentas: 2,
    rentasActivas: 0,
    rentasRetraso: 1,
    montoTotal: 18.00,
    estacionMasUsada: 'Quicentro Sur'
  },
  {
    id: 3,
    nombre: 'María Pérez',
    email: 'maria@example.com',
    telefono: '+593 97 988 7766',
    cedula: null,
    fechaRegistro: '2023-12-10',
    estado: 'activo',
    rentas: 9,
    rentasActivas: 1,
    rentasRetraso: 2,
    montoTotal: 78.25,
    estacionMasUsada: 'Mall del Sol'
  },
  {
    id: 4,
    nombre: 'Diego Torres',
    email: 'diego@example.com',
    telefono: '+593 96 555 1234',
    cedula: '1102345678',
    fechaRegistro: '2024-03-05',
    estado: 'bloqueado',
    rentas: 3,
    rentasActivas: 0,
    rentasRetraso: 3,
    montoTotal: 25.75,
    estacionMasUsada: 'Malecón 2000'
  },
  {
    id: 5,
    nombre: 'Sofia Mendoza',
    email: 'sofia@example.com',
    telefono: '+593 95 444 5678',
    cedula: null,
    fechaRegistro: '2024-01-30',
    estado: 'activo',
    rentas: 7,
    rentasActivas: 0,
    rentasRetraso: 0,
    montoTotal: 52.00,
    estacionMasUsada: 'Parque Samanes'
  },
  {
    id: 6,
    nombre: 'Luis Herrera',
    email: 'luis@example.com',
    telefono: '+593 94 333 9999',
    cedula: '0922334455',
    fechaRegistro: '2024-04-12',
    estado: 'activo',
    rentas: 4,
    rentasActivas: 1,
    rentasRetraso: 1,
    montoTotal: 32.50,
    estacionMasUsada: 'Quicentro Sur'
  },
  {
    id: 7,
    nombre: 'Carmen Vega',
    email: 'carmen@example.com',
    telefono: '+593 93 222 8888',
    cedula: '1711122233',
    fechaRegistro: '2023-11-25',
    estado: 'bloqueado',
    rentas: 12,
    rentasActivas: 0,
    rentasRetraso: 5,
    montoTotal: 95.00,
    estacionMasUsada: 'Mall del Sol'
  }
]

export const rentas = [
  {
    id: 1,
    usuario: 'Ana López',
    estacionInicio: 'Malecón 2000',
    estacionFin: 'Quicentro Sur',
    horaInicio: '2025-10-01T09:10:00',
    horaFin: '2025-10-01T10:25:00',
    monto: 12.50,
    estado: 'devuelta',
    duracionEstimada: 75, // minutos
  },
  {
    id: 2,
    usuario: 'Carlos Ruiz',
    estacionInicio: 'Quicentro Sur',
    estacionFin: 'Malecón 2000',
    horaInicio: '2025-10-01T11:00:00',
    horaFin: '2025-10-01T11:45:00',
    monto: 8.00,
    estado: 'devuelta',
    duracionEstimada: 45,
  },
  {
    id: 3,
    usuario: 'María Pérez',
    estacionInicio: 'Mall del Sol',
    estacionFin: 'Parque Samanes',
    horaInicio: '2025-10-01T12:30:00',
    horaFin: '2025-10-01T13:50:00',
    monto: 15.00,
    estado: 'devuelta',
    duracionEstimada: 80,
  },
  {
    id: 4,
    usuario: 'Diego Torres',
    estacionInicio: 'Malecón 2000',
    estacionFin: null, // renta activa
    horaInicio: '2025-10-01T14:15:00',
    horaFin: null,
    monto: 0, // se calculará al devolver
    estado: 'activa',
    duracionEstimada: 60,
  },
  {
    id: 5,
    usuario: 'Sofia Mendoza',
    estacionInicio: 'Quicentro Sur',
    estacionFin: 'Mall del Sol',
    horaInicio: '2025-10-01T15:30:00',
    horaFin: '2025-10-01T16:45:00',
    monto: 18.75,
    estado: 'devuelta',
    duracionEstimada: 75,
  },
  {
    id: 6,
    usuario: 'Ana López',
    estacionInicio: 'Parque Samanes',
    estacionFin: null,
    horaInicio: '2025-10-01T17:00:00',
    horaFin: null,
    monto: 0,
    estado: 'activa',
    duracionEstimada: 90,
  },
]

export const finanzas = {
  ingresosTotales: 125000,
  ingresosPorEstacion: [
    { estacion: 'Centro', monto: 55000 },
    { estacion: 'Norte', monto: 42000 },
    { estacion: 'Sur', monto: 28000 },
  ],
  // Serie de últimos 14 días con fechas reales dd/MM
  rentasPorDia: (() => {
    const days = 14
    const today = new Date()
    const arr = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const label = `${dd}/${mm}`
      const rentas = Math.floor(Math.random() * 40) + 5
      const ingresos = rentas * (50 + Math.floor(Math.random() * 30)) // ticket promedio 50-80
      arr.push({ fecha: label, rentas, ingresos })
    }
    return arr
  })(),
  // Top 5 estaciones por rentas (mock del mes)
  topEstacionesMes: [
    { estacion: 'Malecón 2000', rentas: 320 },
    { estacion: 'Quicentro Sur', rentas: 280 },
    { estacion: 'Mall del Sol', rentas: 260 },
    { estacion: 'Parque Samanes', rentas: 210 },
    { estacion: 'Terminal Terrestre', rentas: 190 },
  ],
  // Métricas de mes actual vs anterior (mock)
  resumenMensual: {
    mesActual: { ingresos: 104166, rentas: 1180 },
    mesAnterior: { ingresos: 95000, rentas: 1100 },
  },
}

// Tipos: 'renta_finalizada', 'renta_activa', 'penalizacion', 'otros'
export const transacciones = [
  { id: 'T-1001', fecha: '2025-09-25T09:10:00', usuario: 'Ana López', estacionInicio: 'Malecón 2000', estacionFin: 'Quicentro Sur', tipo: 'renta_finalizada', monto: 12.5, estadoPago: 'pagado' },
  { id: 'T-1002', fecha: '2025-09-25T11:20:00', usuario: 'Carlos Ruiz', estacionInicio: 'Quicentro Sur', estacionFin: 'Mall del Sol', tipo: 'renta_finalizada', monto: 9.0, estadoPago: 'pagado' },
  { id: 'T-1003', fecha: '2025-09-26T14:15:00', usuario: 'María Pérez', estacionInicio: 'Mall del Sol', estacionFin: 'Parque Samanes', tipo: 'renta_finalizada', monto: 15.0, estadoPago: 'pagado' },
  { id: 'T-1004', fecha: '2025-09-28T17:40:00', usuario: 'Diego Torres', estacionInicio: 'Malecón 2000', estacionFin: null, tipo: 'renta_activa', monto: 3.0, estadoPago: 'pendiente' },
  { id: 'T-1005', fecha: '2025-09-29T10:05:00', usuario: 'Sofia Mendoza', estacionInicio: 'Quicentro Sur', estacionFin: 'Mall del Sol', tipo: 'renta_finalizada', monto: 18.75, estadoPago: 'pagado' },
  { id: 'T-1006', fecha: '2025-09-30T08:30:00', usuario: 'Ana López', estacionInicio: 'Parque Samanes', estacionFin: null, tipo: 'renta_activa', monto: 2.0, estadoPago: 'pendiente' },
  { id: 'T-1007', fecha: '2025-09-30T12:00:00', usuario: 'Carmen Vega', estacionInicio: 'Mall del Sol', estacionFin: 'Malecón 2000', tipo: 'penalizacion', monto: 5.0, estadoPago: 'pagado' },
  { id: 'T-1008', fecha: '2025-10-01T09:00:00', usuario: 'Luis Herrera', estacionInicio: 'Quicentro Sur', estacionFin: 'Parque Samanes', tipo: 'otros', monto: 7.5, estadoPago: 'pagado' },
  { id: 'T-1009', fecha: '2025-10-01T10:30:00', usuario: 'Carlos Ruiz', estacionInicio: 'Malecón 2000', estacionFin: null, tipo: 'renta_activa', monto: 1.0, estadoPago: 'pendiente' },
  { id: 'T-1010', fecha: '2025-10-01T16:10:00', usuario: 'Sofia Mendoza', estacionInicio: 'Parque Samanes', estacionFin: 'Quicentro Sur', tipo: 'renta_finalizada', monto: 11.0, estadoPago: 'pagado' },
]

// Serie diaria por estación (últimos 30 días)
export const seriesPorEstacion = (() => {
  const estaciones = estacionesNombres
  const days = 30
  const today = new Date()
  const byStation = {}
  estaciones.forEach((est, idx) => {
    const arr = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const label = `${dd}/${mm}`
      // variar por estación
      const base = 10 + idx * 5
      const rentas = base + Math.floor(Math.random() * 30)
      const ingresos = rentas * (60 + Math.floor(Math.random() * 40))
      arr.push({ fecha: label, rentas, ingresos })
    }
    byStation[est] = arr
  })
  return byStation
})()

// Alertas mock
export const alertas = {
  estacionesOffline: [
    { id: 'ST-002', nombre: 'Parque Samanes' },
    { id: 'ST-005', nombre: 'Terminal Terrestre' },
  ],
  cargadoresDanados: [
    { id: 'CH-1012', estacion: 'Malecón 2000' },
    { id: 'CH-2031', estacion: 'Quicentro Sur' },
    { id: 'CH-3344', estacion: 'Mall del Sol' },
    { id: 'CH-4477', estacion: 'Parque Samanes' },
    { id: 'CH-5521', estacion: 'Terminal Terrestre' },
    { id: 'CH-6620', estacion: 'Malecón 2000' },
    { id: 'CH-7719', estacion: 'Quicentro Sur' },
    { id: 'CH-8828', estacion: 'Mall del Sol' },
    { id: 'CH-9937', estacion: 'Parque Samanes' },
    { id: 'CH-1006', estacion: 'Terminal Terrestre' },
    { id: 'CH-1105', estacion: 'Malecón 2000' },
    { id: 'CH-1204', estacion: 'Quicentro Sur' },
    { id: 'CH-1303', estacion: 'Mall del Sol' },
    { id: 'CH-1402', estacion: 'Parque Samanes' },
    { id: 'CH-1501', estacion: 'Terminal Terrestre' },
  ],
}


