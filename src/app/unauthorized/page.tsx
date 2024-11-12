import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Acceso No Autorizado
        </h1>
        <p className="mt-2 text-gray-600">
          No tienes permisos para acceder a esta página.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
} 