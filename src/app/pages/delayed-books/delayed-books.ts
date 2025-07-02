import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delayed-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delayed-books.html'
})
export class DelayedBooksComponent implements OnInit {
  books: any[] = [];
  isAdmin = false;
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;
  errorMessage = '';

  constructor(private bookService: BookService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
    this.loadBooks();
  }

  loadBooks() {
    if (this.isAdmin) {
      this.bookService.getAllOverdueBooks(this.page, this.pageSize).subscribe({
        next: (res) => {
          // console.log('Admin overdue books res:', res);
          this.books = res.items || [];
          this.totalCount = res.totalCount || 0;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        },
        error: () => {
          this.errorMessage = 'Failed to load overdue books.';
        }
      });
    } else {
      this.bookService.getMyOverdueBooks().subscribe({
        next: (res) => {
          // console.log('User overdue books res:', res);
          this.books = res.items || res.data || res || [];
          this.totalCount = this.books.length;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        },
        error: () => {
          this.errorMessage = 'Failed to load your overdue books.';
        }
      });
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBooks();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadBooks();
    }
  }
}
