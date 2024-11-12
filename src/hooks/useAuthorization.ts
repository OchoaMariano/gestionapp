import { useSession } from 'next-auth/react';
import { ExtendedSession } from '@/types/auth';

export function useAuthorization() {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const isAdmin = session?.user?.role === 'admin';
  const isUser = session?.user?.role === 'usuario';

  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;
  const canView = isAdmin || isUser;

  return {
    isAdmin,
    isUser,
    canCreate,
    canEdit,
    canDelete,
    canView,
  };
} 