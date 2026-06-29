import { Routes } from '@angular/router';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
  },
  {
    path: 'login',
    canActivate: [authGuard(['guest'])],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    canActivate: [authGuard(['guest'])],
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
  },
  {
    path: 'app',
    component: SidebarLayout,
    children: [
      { path: '', redirectTo: 'theory', pathMatch: 'full' },
      { 
        path: 'profile', 
        canActivate: [authGuard(['professor', 'student'])],
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) 
      },
      { 
        path: 'theory', 
        canActivate: [authGuard(['professor', 'student'])],
        loadComponent: () => import('./pages/theory/theory').then(m => m.Theory) 
      },
      { 
        path: 'record', 
        canActivate: [authGuard(['student'])],
        loadComponent: () => import('./pages/student-record/student-record').then(m => m.StudentRecord) 
      },
      { 
        path: 'record/:studentId', 
        canActivate: [authGuard(['professor'])],
        loadComponent: () => import('./pages/student-record/student-record').then(m => m.StudentRecord) 
      },
      { 
        path: 'procedure/:procedureId', 
        canActivate: [authGuard(['professor', 'student'])],
        loadComponent: () => import('./pages/student-dashboard/student-dashboard').then(m => m.StudentDashboard) 
      },
      { 
        path: 'students', 
        canActivate: [authGuard(['professor'])],
        loadComponent: () => import('./pages/students/students').then(m => m.Students) 
      },
      { 
        path: 'pending', 
        canActivate: [authGuard(['professor'])],
        loadComponent: () => import('./pages/pending-procedures/pending-procedures').then(m => m.PendingProcedures) 
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
