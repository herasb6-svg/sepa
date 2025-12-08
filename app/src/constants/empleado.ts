export const AREAS = [
  { label: 'Oficina', value: 'OFICINA' },
  { label: 'Producción', value: 'PRODUCCION' },
  { label: 'Inventario', value: 'INVENTARIO' },
] as const;

export const TURNOS = [
  { label: 'Matutino', value: 'MATUTINO' },
  { label: 'Vespertino', value: 'VESPERTINO' },
  { label: 'Nocturno', value: 'NOCTURNO' },
  { label: 'Mixto', value: 'MIXTO' },
] as const;

export type AreaType = typeof AREAS[number]['value'];
export type TurnoType = typeof TURNOS[number]['value'];

// Valores por defecto
export const DEFAULT_EMPLEADO = {
  nombre: '',
  apellido_p: '',
  apellido_m: '',
  area: 'OFICINA' as AreaType,
  turno: 'MATUTINO' as TurnoType,
  salarioDiario: 0,
  activo: true,
};
