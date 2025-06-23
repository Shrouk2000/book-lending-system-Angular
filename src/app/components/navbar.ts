import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get isAdmin() {
    return this.auth.getRole() === 'Admin';
  }

  get isMember() {
    return this.auth.getRole() === 'Member';
  }

  logout() {
    this.auth.logout();
  }
}
