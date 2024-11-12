export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'OTRO';

export interface Payment {
  id: string;
  amount: number;
  date: Date;
  method: PaymentMethod;
  description?: string | null;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
} 