'use client';

import { AuthUserProfile } from './types';

const ACCESS_TOKEN_KEY = 'unify_access_token';
const REFRESH_TOKEN_KEY = 'unify_refresh_token';
const USER_KEY = 'unify_user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const authStore = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser(): AuthUserProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUserProfile;
    } catch {
      return null;
    }
  },
  setSession(tokens: AuthTokens, user: AuthUserProfile) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('unify-auth-changed'));
  },
  setTokens(tokens: AuthTokens) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('unify-auth-changed'));
  },
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
  hasPermission(user: AuthUserProfile | null, permission: string): boolean {
    if (!user) return false;
    if (user.roles?.includes('Super Admin')) return true;
    const [resource] = permission.split(':');
    return user.permissions?.some(
      (p) => p === permission || p === `${resource}:manage`
    );
  },
};
