import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
   styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.getRole() === 'Admin';
  }

  get isMember(): boolean {
    return this.auth.getRole() === 'Member';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
