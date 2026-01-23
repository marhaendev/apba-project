import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

declare const lucide: any;

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    isEditMode = signal(false);
    userId = signal<number | null>(null);
    isLoading = signal(false);
    errorMessage = signal('');

    userForm = this.fb.group({
        username: ['', Validators.required],
        password: [''], // Optional in edit, required in create (handled in submit)
        nama: ['', Validators.required],
        hakakses: ['user', Validators.required],
        kdlink: [''],
        kdcbang: ['']
    });

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.userId.set(Number(id));
            this.loadUser(Number(id));
        } else {
            // Create mode: Password is required
            this.userForm.get('password')?.addValidators(Validators.required);
            this.userForm.get('password')?.updateValueAndValidity();
        }

        setTimeout(() => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 100);
    }

    loadUser(id: number) {
        this.isLoading.set(true);
        this.userService.getUser(id).subscribe({
            next: (user: any) => {
                this.userForm.patchValue({
                    username: user.username,
                    nama: user.nama,
                    hakakses: user.hakakses,
                    kdlink: user.kdlink,
                    kdcbang: user.kdcbang,
                    password: ''
                });
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
                this.errorMessage.set('Failed to load user');
            }
        });
    }

    onSubmit() {
        if (this.userForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        const userData = this.userForm.value as any; // Cast to avoid partial issues
        if (!userData.password) delete userData.password; // Remove empty password on edit if not changed

        const req = this.isEditMode()
            ? this.userService.updateUser(this.userId()!, userData)
            : this.userService.createUser(userData);

        req.subscribe({
            next: () => {
                this.router.navigate(['/users']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Operation failed');
            }
        });
    }
}
