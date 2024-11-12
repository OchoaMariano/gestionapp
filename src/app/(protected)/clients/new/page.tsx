'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { clientSchema, type ClientFormData } from '@/schemas/validations';
import { FormField } from '@/components/forms/FormField';

export default function NewClientPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/clients');
        router.refresh();
      } else {
        throw new Error('Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Nuevo Cliente
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Nombre"
            name="name"
            error={errors.name?.message}
          >
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
          </FormField>

          <FormField
            label="Correo Electrónico"
            name="email"
            error={errors.email?.message}
          >
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
          </FormField>

          <FormField
            label="Teléfono"
            name="phone"
            error={errors.phone?.message}
          >
            <input
              type="tel"
              {...register('phone')}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.phone
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
          </FormField>

          <FormField
            label="Dirección"
            name="address"
            error={errors.address?.message}
          >
            <textarea
              {...register('address')}
              rows={3}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.address
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
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
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}