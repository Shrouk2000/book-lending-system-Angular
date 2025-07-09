import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

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
  private auth = inject(AuthService);

  ngOnInit(): void {
    if (this.auth.getRole() === 'Admin') {
      this.loadAllBorrowedBooks();
    } else {
      this.loadCurrentlyBorrowedBooks();
    }
  }

  loadCurrentlyBorrowedBooks() {
    this.bookService.getMyCurrentlyBorrowedBooks().subscribe({
      next: (res: any) => {
        this.books = (res?.items || res?.data || res || []).filter((book: any) =>
          book.statusBook !== 'Returned'
        );
      },
      error: () => {
        this.showMessage('error', 'Failed to load borrowed books.');
      }
    });
  }

  loadAllBorrowedBooks() {
    this.bookService.getAllBorrowedBooks().subscribe({
      next: (res: any) => {
        this.books = res?.items || res?.data || res || [];
      },
      error: () => {
        this.showMessage('error', 'Failed to load all borrowed books.');
      }
    });
  }

  returnBook(bookId: number) {
    this.bookService.returnBook(bookId).subscribe({
      next: () => {
        this.books = this.books.filter(book => book.bookId !== bookId && book.id !== bookId);
        this.showMessage('success', 'Book returned successfully.');
      },
      error: () => {
        this.showMessage('error', 'Failed to return book.');
      }
    });
  }

  private showMessage(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }

    setTimeout(() => {
      if (type === 'success') {
        this.successMessage = '';
      } else {
        this.errorMessage = '';
      }
    }, 3000);
  }
}
