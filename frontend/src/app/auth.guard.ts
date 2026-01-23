import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.currentUser()) {
        return true;
    }

    // Check storage fallback (if service initialized late or reload)
    if (localStorage.getItem('user')) {
        return true;
    }

    return router.navigate(['/login']);
};

export const adminGuard = () => {
    const authService = inject(AuthService);
    // Re-check storage if needed or rely on service state which should be hydrated
    if (authService.currentUser()?.role === 'admin') {
        return true;
    }
    return false; // Or redirect
};
