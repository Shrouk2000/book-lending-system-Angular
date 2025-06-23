import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.html'
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  constructor(private bookService: BookService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        console.log('Books received from API:', res);
        this.books = res.items;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.errorMessage = 'Failed to load books.';
      }
    });
  }

 borrow(id: number) {
  this.bookService.borrowBook(id).subscribe({
    next: () => {
      this.loadBooks();
    },
    error: (err) => {
      console.error('Borrow failed:', err);
      this.errorMessage = 'Failed to borrow the book.';
    }
  });
}

return(id: number) {
  this.bookService.returnBook(id).subscribe({
    next: () => {
      this.loadBooks();
    },
    error: (err) => {
      console.error('Return failed:', err);
      this.errorMessage = 'Failed to return the book.';
    }
  });
}


  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: () => alert('Failed to delete book.')
      });
    }
  }
}
