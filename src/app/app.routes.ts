import { Routes } from '@angular/router';
import { Home } from './Features/home/Components/home/home';
import { About } from './Features/home/Components/about/about';
import { NewsCard } from './Features/news/news-card/news-card';
import { AllNews } from './Features/news/all-news/all-news';
import { NewsDetails } from './Features/news/news-details/news-details';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },


    {path: 'newsCard', component: NewsCard},
    {path: 'allNews', component: AllNews},
    {path: 'newsDtl/:id', component: NewsDetails},
];
