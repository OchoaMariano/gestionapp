export const TAX_TYPES = [
  { value: 'IVA', label: 'IVA' },
  { value: 'GANANCIAS', label: 'Ganancias' },
  { value: 'IIBB', label: 'Ingresos Brutos' },
  { value: 'MUNICIPAL', label: 'Tasas Municipales' },
  { value: 'OTROS', label: 'Otros' },
] as const;

export const TAX_STATUS = {
  PENDING: 'PENDIENTE',
  PAID: 'PAGADO',
  OVERDUE: 'VENCIDO',
} as const; 