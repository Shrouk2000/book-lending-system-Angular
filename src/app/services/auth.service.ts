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


  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, {
      email: credentials.email.trim(),
      password: credentials.password.trim()
    });
  }

 
  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, {
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      phoneNumber: userData.phoneNumber.trim()
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}


  getRole(): string {
  const token = this.getToken();
  if (!token) return '';

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
}

getUserId(): string {
  const token = this.getToken();
  if (!token) return '';
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
}



}
