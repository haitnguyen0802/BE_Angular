import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Trang đăng nhập - mặc định
  { path: 'login', component: LoginComponent },
  
  // Dashboard - được bảo vệ bởi AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  
  // Chuyển hướng từ trang chủ đến trang đăng nhập
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Chuyển hướng từ bất kỳ trang không xác định nào đến trang đăng nhập
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 