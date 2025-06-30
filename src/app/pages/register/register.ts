import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: '/register.html',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  phoneNumber = '';
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }

    const userData = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      phoneNumber: this.phoneNumber.trim(),
    };

    this.auth.register(userData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500); // redirects after 1.5 seconds
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMessage = err.error || 'Registration failed.';
      },
    });
  }
}
