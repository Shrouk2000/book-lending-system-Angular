import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  generalError = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    this.generalError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const credentials = this.loginForm.value;

    this.auth.login(credentials).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
        const decoded = JSON.parse(atob(res.token.split('.')[1]));
        const role = decoded.role;
        this.router.navigate([role === 'Admin' ? '/admin' : '/book-list']);
        this.loading = false;
      },
      error: (err) => {
        this.generalError = err.error?.message || 'Invalid email or password. Please try again.';
        this.loading = false;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
