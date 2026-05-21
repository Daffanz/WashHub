import { useAuth } from './useAuth';

export function usePermission(permission) {
  const { hasPermission, hasRole } = useAuth();

  // Super Admin has all permissions
  if (hasRole('Super Admin')) return true;

  return hasPermission(permission);
}
