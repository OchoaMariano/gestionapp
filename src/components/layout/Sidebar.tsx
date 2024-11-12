'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowTrendingDownIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import { useAuthorization } from '@/hooks/useAuthorization';

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { isAdmin } = useAuthorization();

  const adminNavigation = [
    {
      name: 'Usuarios',
      href: '/admin/users',
      icon: UserGroupIcon,
    },
  ];

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Clientes', href: '/clients', icon: UserGroupIcon },
    { name: 'Pagos', href: '/payments', icon: BanknotesIcon },
    { name: 'Egresos', href: '/expenses', icon: ArrowTrendingDownIcon },
    { name: 'Impuestos', href: '/taxes', icon: CalculatorIcon },
    ...(isAdmin ? adminNavigation : []),
  ].filter(item => {
    // Si es admin, mostrar todo
    if (isAdmin) return true;
    // Si es usuario normal, solo mostrar dashboard y vistas de lectura
    return item.href === '/dashboard';
  });

  return (
    <>
      {/* Overlay para móvil */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Barra lateral */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
              <span className="text-white text-xl font-semibold">GestionApp</span>
            </div>

            {/* Links de navegación */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar móvil */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
            <span className="text-white text-xl font-semibold">GestionApp</span>
          </div>

          {/* Links de navegación */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
} 