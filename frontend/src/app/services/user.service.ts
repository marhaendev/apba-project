import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id_user?: number;
    username: string;
    password?: string;
    nama: string;
    hakakses: string;
    kdlink?: string;
    kdcbang?: string;
}

export interface UserResponse {
    total: number;
    page: number;
    totalPages: number;
    data: User[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/users';

    constructor(private http: HttpClient) { }

    getUsers(page: number = 1, limit: number = 10): Observable<UserResponse> {
        let params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<UserResponse>(this.apiUrl, { params });
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    createUser(user: User): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(id: number, user: Partial<User>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
