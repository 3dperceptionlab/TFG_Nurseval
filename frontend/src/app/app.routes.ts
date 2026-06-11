import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Theory } from './pages/theory/theory';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { SidebarLayout } from './layout/sidebar-layout/sidebar-layout';
import { StudentRecord } from './pages/student-record/student-record';
import { Students } from './pages/students/students';
import { Profile } from './pages/profile/profile';
import { PendingProcedures } from './pages/pending-procedures/pending-procedures';

export const routes: Routes = [
    {
        path: '',
        component: Landing,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'register',
        component: Register,
    },
    {
    path: 'app',
    component: SidebarLayout,
    children: [
      { path: '', redirectTo: 'theory', pathMatch: 'full' },
      { path: 'profile', component: Profile },
      { path: 'theory', component: Theory },
      { path: 'procedures/:studentId', component: StudentRecord },
      { path: 'procedure/:procedureId', component: StudentDashboard },
      { path: 'students', component: Students },
      { path: 'pending', component: PendingProcedures },
    ]
  },
  { path: '**', redirectTo: '' }
];
