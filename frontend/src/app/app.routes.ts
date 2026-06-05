import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Theory } from './pages/theory/theory';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {
        path: '',
        component: Landing,
    },
    {
        path: 'theory',
        component: Theory,
    },
    {
        path: 'student/evaluations/:evaluationId',
        component: StudentDashboard,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'register',
        component: Register,
    }
];
