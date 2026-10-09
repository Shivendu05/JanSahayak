import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  try {
    const session = JSON.parse(localStorage.getItem('user') ?? 'null');
    if (session?.role === 'ADMIN') {
      return true;
    }
  } catch {
    // Invalid local session is treated as signed out.
  }
  return router.parseUrl('/admin-login');
};

export const citizenGuard: CanActivateFn = () => {
  const router = inject(Router);
  try {
    const session = JSON.parse(localStorage.getItem('user') ?? 'null');
    if (session?.role === 'USER') {
      return true;
    }
  } catch {
    // Invalid local session is treated as signed out.
  }
  return router.parseUrl('/login');
};