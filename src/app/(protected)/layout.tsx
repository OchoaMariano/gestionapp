'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 pb-8">
          <div className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 