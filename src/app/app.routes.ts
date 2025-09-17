import { Routes } from '@angular/router';
import { Home } from './Features/home/Components/home/home';
import { About } from './Features/home/Components/about/about';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'news', component: Home },
    { path: 'products', component: Home },
    { path: 'contact', component: Home },
];
