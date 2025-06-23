import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading=false

  constructor(private auth: AuthService, private router: Router) {}

login() {
  if (!this.email || !this.password) {
    this.errorMessage = 'Email and password are required.';
    return;
  }

  const credentials = {
    email: this.email.trim(),
    password: this.password
  };

  this.auth.login(credentials).subscribe({
    next: (res: any) => {
      this.auth.setToken(res.token);
      const decoded = JSON.parse(atob(res.token.split('.')[1]));
      const role = decoded.role;
      this.router.navigate([role === 'Admin' ? '/admin' : '/']);
    },
    error: (err) => {
      console.error('Login error:', err);
      this.errorMessage = err.error || 'Login failed. Please check your credentials.';
    }
  });
}



}
