import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  phoneNumber = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const user = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      phoneNumber: this.phoneNumber.trim()
    };

    this.auth.register(user).subscribe({
      next: (res: any) => {
        console.log('📥 Registration response:', res);

        // Case: backend returns string array of validation messages
        if (Array.isArray(res)) {
          this.errorMessage = res.join(', ');
        }
        // Case: successful registration
        else if (res?.isSuccess) {
          this.errorMessage = '';
          this.router.navigate(['/login']);
        }
        // Case: backend returned error message
        else {
          this.errorMessage = res?.message || 'Registration failed.';
        }
      },
      error: (err) => {
        console.error(' Registration error:', err);
        this.errorMessage = 'Something went wrong. Try again.';
      }
    });
  }
}
