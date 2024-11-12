'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { taxSchema, type TaxFormData } from '@/schemas/validations';
import { FormField } from '@/components/forms/FormField';
import { TAX_TYPES, TAX_STATUS } from '@/constants/taxes';

export default function NewTaxPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
  });

  const onSubmit = async (data: TaxFormData) => {
    try {
      const res = await fetch('/api/taxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: TAX_STATUS.PENDING,
        }),
      });

      if (res.ok) {
        router.push('/taxes');
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al registrar el impuesto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Registrar Nuevo Impuesto
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Tipo de Impuesto"
            name="type"
            error={errors.type?.message}
          >
            <select
              {...register('type')}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.type
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            >
              <option value="">Seleccionar tipo</option>
              {TAX_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Monto"
            name="amount"
            error={errors.amount?.message}
          >
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className={`pl-7 block w-full rounded-md shadow-sm ${
                  errors.amount
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
                placeholder="0.00"
              />
            </div>
          </FormField>

          <FormField
            label="Fecha de Vencimiento"
            name="dueDate"
            error={errors.dueDate?.message}
          >
            <input
              type="date"
              {...register('dueDate')}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.dueDate
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
          </FormField>

          <FormField
            label="Descripción"
            name="description"
            error={errors.description?.message}
          >
            <textarea
              {...register('description')}
              rows={3}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              placeholder="Detalles adicionales..."
            />
          </FormField>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Registrar Impuesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 