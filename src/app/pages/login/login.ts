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

  constructor(private auth: AuthService, private router: Router) {}

  login() {
  console.log('Logging in with:', this.email, this.password);

  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (res: any) => {
      if (!res.token) {
        this.errorMessage = 'Login failed: No token returned';
        return;
      }

      this.auth.setToken(res.token);

      try {
        const decoded = JSON.parse(atob(res.token.split('.')[1]));
        const role = decoded.role;
        console.log('Login successful, role:', role);
        this.router.navigate([role === 'Admin' ? '/admin' : '/']);
      } catch (e) {
        console.error('Token decoding failed', e);
        this.errorMessage = 'Login failed: Invalid token';
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      this.errorMessage = err?.error?.message || 'Invalid email or password';
    }
  });
}

}
