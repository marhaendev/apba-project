import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api';
    currentUser = signal<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        // Check localStorage on load
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    login(payload: any) {
        return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                if (res.token) {
                    try {
                        const decoded: any = jwtDecode(res.token);
                        const user = {
                            username: decoded.username,
                            role: decoded.role
                        };
                        this.currentUser.set(user);
                        localStorage.setItem('user', JSON.stringify(user));
                    } catch (e) {
                        console.error('Token decode failed', e);
                    }
                }
            })
        );
    }

    logout() {
        return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
            tap(() => this.cleanup()),
            catchError(() => {
                this.cleanup();
                return of(null);
            })
        );
    }

    cleanup() {
        this.currentUser.set(null);
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }

    get isAdmin() {
        return this.currentUser()?.role === 'admin';
    }
}
