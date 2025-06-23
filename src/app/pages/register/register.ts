import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'Member'; // default
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };
      console.log('Sending data:', data);

    this.auth.register(data).subscribe({
      next: () => {
        this.successMessage = 'Registered successfully! You can now login.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Try again.';
        this.successMessage = '';
      }
    });
  }
}
