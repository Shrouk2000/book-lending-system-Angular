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
  this.errorMessage = '';
  this.loading = true;
  const email = this.email;
  const password = this.password;
  console.log('Logging in with:', email, password);

  this.auth.login({ email, password }).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.auth.setToken(res.token);
      const decoded = JSON.parse(atob(res.token.split('.')[1]));
      const role = decoded.role;
      this.router.navigate([role === 'Admin' ? '/admin' : '/']);
    },
    error: (err) => {
      this.loading = false;
      console.error('Login error:', err);
      if (err.status === 400) {
        this.errorMessage = 'Invalid email or password. Please try again.';
      } else {
        this.errorMessage = 'Something went wrong. Try again later.';
      }
    }
  });
}

}
