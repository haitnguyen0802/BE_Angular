import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Base API URL - update this to your backend API URL when ready
  private apiUrl = 'https://api.example.com';
  
  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * GET request
   * @param endpoint API endpoint path
   * @returns Observable of response
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   * @param endpoint API endpoint path
   * @param data Request payload
   * @returns Observable of response
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   * @param endpoint API endpoint path
   * @param data Request payload
   * @returns Observable of response
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   * @param endpoint API endpoint path
   * @returns Observable of response
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Error handling
   * @param error HTTP error
   * @returns Error Observable
   */
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 