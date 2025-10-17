import { Routes } from '@angular/router';
import { Home } from './Features/home/Components/home/home';
import { NewsCard } from './Features/news/news-card/news-card';
import { NewsDetails } from './Features/news/news-details/news-details';
import { ProductDetails } from './Features/products/product-details/product-details';
import { LoginComponent } from './Features/auth/login/login';
import { AdminDashboardComponent } from './Features/admin/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'home', component: Home },
    { path: 'login', component: LoginComponent },

    {path: 'newsCard', component: NewsCard},
    {path: 'newsDtl/:id', component: NewsDetails},
    {path: 'productDtl/:id', component: ProductDetails},
    
    {path : '**', redirectTo: '/home'}
];
