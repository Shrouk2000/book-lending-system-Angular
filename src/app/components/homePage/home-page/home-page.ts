import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  browseBooks() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/book-list']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
