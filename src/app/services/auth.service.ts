import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  role?: string;
  token?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUser();
  }

  private loadUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // Lấy danh sách user từ API và kiểm tra thông tin đăng nhập
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          // Tạo token giả
          const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
          
          // Lưu thông tin người dùng vào localStorage
          const authUser = {
            ...user,
            token
          };
          
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          this.currentUserSubject.next(authUser);
          return authUser;
        }
        
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
      }),
      catchError(error => {
        console.error('Lỗi đăng nhập:', error);
        return throwError(() => new Error('Đăng nhập thất bại. Vui lòng thử lại.'));
      })
    );
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
} 