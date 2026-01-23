import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
    private userService = inject(UserService);
    public authService = inject(AuthService);

    users = signal<User[]>([]);
    total = signal(0);
    currentPage = signal(1);
    totalPages = signal(1);
    pageSize = 10;

    searchTerm = signal('');
    roleFilter = signal('');
    sortColumn = signal<keyof User | ''>('');
    sortDirection = signal<'asc' | 'desc'>('asc');

    filteredUsers = computed(() => {
        let list = [...this.users()];

        // Role Filtering
        const role = this.roleFilter();
        if (role) {
            list = list.filter(u => u.hakakses === role);
        }

        // Search Filtering
        const term = this.searchTerm().toLowerCase();
        if (term) {
            list = list.filter(u =>
                u.username.toLowerCase().includes(term) ||
                u.nama.toLowerCase().includes(term) ||
                (u.hakakses && u.hakakses.toLowerCase().includes(term))
            );
        }
        const col = this.sortColumn();
        if (col) {
            const dir = this.sortDirection() === 'asc' ? 1 : -1;
            list.sort((a, b) => {
                const valA = (a[col] ?? '').toString().toLowerCase();
                const valB = (b[col] ?? '').toString().toLowerCase();
                return valA < valB ? -1 * dir : (valA > valB ? 1 * dir : 0);
            });
        }
        return list;
    });

    errorMsg = signal('');

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers(page: number = 1) {
        this.userService.getUsers(page, this.pageSize).subscribe({
            next: (res) => {
                this.users.set(res.data);
                this.total.set(res.total);
                this.currentPage.set(res.page);
                this.totalPages.set(res.totalPages);
            },
            error: (err) => this.errorMsg.set('Failed to load users')
        });
    }

    deleteUser(id: number) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        this.userService.deleteUser(id).subscribe({
            next: () => {
                this.loadUsers(this.currentPage());
            },
            error: (err) => {
                alert(err.error?.message || 'Delete failed');
            }
        });
    }

    onPageChange(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.loadUsers(page);
        }
    }

    toggleSort(col: keyof User) {
        if (this.sortColumn() === col) {
            this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortColumn.set(col);
            this.sortDirection.set('asc');
        }
    }

    logout() {
        this.authService.logout().subscribe();
    }
}
