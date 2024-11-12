'use client';

import { signOut, useSession } from 'next-auth/react';
import {
  Bars3Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export function Header({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Abrir menú</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="ml-4 flex items-center md:ml-6">
            <div className="hidden md:flex items-center text-sm text-gray-600 mr-4">
              {session?.user?.email}
            </div>

            <button
              onClick={() => signOut()}
              className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-2 hover:bg-gray-100"
            >
              <span className="sr-only">Cerrar sesión</span>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}