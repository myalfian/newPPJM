import { useMemo } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { AppRole, ROLE_LABEL, homeForRole } from '../lib/roles';

/**
 * Guest-aware auth hook.
 *
 *   const { user, role, isGuest } = useAuth();
 *
 * - `role` is the canonical 9-role value, or `'guest'` when nobody is signed in.
 * - `isGuest` is `true` when there is no session (or the role is still `guest`).
 * Everything else from the underlying AuthContext is passed through unchanged.
 */
export function useAuth() {
  const ctx = useAuthContext();
  const role: AppRole = ctx.appRole;
  const isGuest = !ctx.user || role === 'guest';

  return useMemo(
    () => ({
      ...ctx,
      /** Legacy 5-value role used by the older admin screens. */
      legacyRole: ctx.role,
      role,
      isGuest,
      roleLabel: ROLE_LABEL[role],
      homePath: homeForRole(role),
    }),
    [ctx, role, isGuest],
  );
}

