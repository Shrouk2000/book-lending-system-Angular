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
    username: this.username,
    email: this.email,
    password: this.password,
    phoneNumber: this.phoneNumber 
  };

 
  //   next: res => {
  //     if (res.isSuccess) {
  //       this.router.navigate(['/login']);
  //     } else {
  //       this.errorMessage = res.message || 'Registration failed.';
  //     }
  //   },
  //   error: () => this.errorMessage = 'Something went wrong. Try again.'
  // });
this.auth.register(user).subscribe({
  next: (res: any) => { 
    if (res.isSuccess) {
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = res.message || 'Registration failed.';
    }
  },
  error: () => this.errorMessage = 'Something went wrong. Try again.'
});

}

}
