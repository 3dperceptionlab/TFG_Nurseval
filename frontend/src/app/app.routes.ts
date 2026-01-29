import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Theory } from './components/theory/theory';

export const routes: Routes = [
    {
        path: '',
        component: Landing,
    },
    {
        path: 'theory',
        component: Theory,
    }
];
