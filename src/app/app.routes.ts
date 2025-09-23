import { Routes } from '@angular/router';
import { Home } from './Features/home/Components/home/home';
import { NewsCard } from './Features/news/news-card/news-card';
import { NewsDetails } from './Features/news/news-details/news-details';
import { ProductDetails } from './Features/products/product-details/product-details';

export const routes: Routes = [
    
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },


    {path: 'newsCard', component: NewsCard},
    {path: 'newsDtl/:id', component: NewsDetails},

    
    {path: 'productDtl/:id', component: ProductDetails},

    
];
