import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { authGuard, adminGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [authGuard] // Add adminGuard if strictly admin
    },
    {
        path: 'users/edit/:id',
        component: UserFormComponent,
        canActivate: [authGuard]
    }
];
