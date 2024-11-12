import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z.string()
    .email('Ingrese un correo electrónico válido')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^\+?[\d\s-]{8,}$/, 'Ingrese un número de teléfono válido')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
});

export const paymentSchema = z.object({
  clientId: z.string().min(1, 'Seleccione un cliente'),
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto'),
  date: z.string().min(1, 'Seleccione una fecha'),
  method: z.enum(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO'], {
    errorMap: () => ({ message: 'Seleccione un método de pago válido' })
  }),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export const expenseSchema = z.object({
  description: z.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  category: z.enum(['SERVICIOS', 'SALARIOS', 'INSUMOS', 'MARKETING', 'MANTENIMIENTO', 'IMPUESTOS', 'OTROS'], {
    errorMap: () => ({ message: 'Seleccione una categoría válida' })
  }),
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto'),
  date: z.string().min(1, 'Seleccione una fecha'),
});

export const taxSchema = z.object({
  type: z.enum(['IVA', 'GANANCIAS', 'IIBB', 'MUNICIPAL', 'OTROS'], {
    errorMap: () => ({ message: 'Seleccione un tipo de impuesto válido' })
  }),
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado alto'),
  dueDate: z.string().min(1, 'Seleccione una fecha de vencimiento'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type TaxFormData = z.infer<typeof taxSchema>; 