// Metadatos compartidos para los 3 estados de cuenta.
export const STATUS_META = {
  active: {
    label: 'Activo/Verificado',
    dot: 'text-emerald-400',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  review: {
    label: 'En Pausa/Revisión',
    dot: 'text-amber-400',
    text: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  blocked: {
    label: 'Desconectado/Bloqueado',
    dot: 'text-red-400',
    text: 'text-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
};

export const STATIONS = ['Estación Alfa', 'Estación Beta', 'Estación Gamma'];
