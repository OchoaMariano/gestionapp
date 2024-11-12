import { ReactNode } from 'react';
import { useAuthorization } from '@/hooks/useAuthorization';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('admin' | 'usuario')[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { isAdmin, isUser } = useAuthorization();

  const hasPermission = (
    (allowedRoles.includes('admin') && isAdmin) ||
    (allowedRoles.includes('usuario') && isUser)
  );

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
} 