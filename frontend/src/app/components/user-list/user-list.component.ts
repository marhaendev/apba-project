import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css' // Assuming default empty css or I can ignore
})
export class UserListComponent implements OnInit {
    private userService = inject(UserService);
    public authService = inject(AuthService); // Public for template access

    users = signal<User[]>([]);
    total = signal(0);
    currentPage = signal(1);
    totalPages = signal(1);
    pageSize = 10;

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
                this.loadUsers(this.currentPage()); // Reload current page
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

    logout() {
        this.authService.logout().subscribe();
    }
}
