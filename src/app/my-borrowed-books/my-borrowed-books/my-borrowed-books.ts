import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-my-borrowed-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-borrowed-books.html'
})
export class MyBorrowedBooksComponent implements OnInit {
  books: any[] = [];
  errorMessage = '';
  successMessage = '';
  private bookService = inject(BookService);

  ngOnInit(): void {
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks() {
    this.bookService.getMyBorrowedBooks().subscribe({
      next: (res: any) => {
        console.log('Borrowed Books:', res);
        this.books = res?.items || res || [];
         console.log('Loaded borrowed books:', this.books); 
      },
      error: () => {
        this.errorMessage = 'Failed to load borrowed books.';
      }
    });
  }

  returnBook(bookId: number) {
    this.bookService.returnBook(bookId).subscribe({
      next: () => {
        this.successMessage = 'Book returned successfully.';
        this.loadBorrowedBooks();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to return book.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }
}
