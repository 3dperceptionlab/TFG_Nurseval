import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Theory } from './components/theory/theory';
import { StudentDashboard } from './components/student-dashboard/student-dashboard';

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
    }
];
