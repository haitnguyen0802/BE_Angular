import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoriesComponent } from './components/categories/categories.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '**', redirectTo: '/dashboard' } // Redirect any unknown routes to dashboard
];
