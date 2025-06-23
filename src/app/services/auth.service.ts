import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://booklending-api-raghda-test.jahezteam.com/api/Account';

  login(credentials: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, {
      Name: userData.name,
      Email: userData.email,
      Password: userData.password,
      Role: userData.role
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
