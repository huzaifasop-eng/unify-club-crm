import { PERMISSIONS, type Permission } from '@/lib/permissions';

/**
 * Permissions of the current user.
 *
 * Supabase Auth and the membership/role tables arrive in Phase 0 (docs/ARCHITECTURE.md §13).
 * Until then there is no session, so every permission is granted to keep the whole navigation
 * reviewable. This is the single function to replace with the membership lookup; nothing else
 * reads permissions directly.
 */
export async function getCurrentPermissions(): Promise<Permission[]> {
  return [...PERMISSIONS];
}
