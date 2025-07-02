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
      // console.log('Currently borrowed books API response:', res);
      
      this.books = (res?.items || res?.data || res || []).filter((book: any) =>
        book.statusBook !== 'Returned'
      );
    },
    error: (err) => {
      // console.error('Failed to load currently borrowed books:', err);
      this.errorMessage = 'Failed to load borrowed books.';
    }
  });
}


 
  loadAllBorrowedBooks() {
    this.bookService.getAllBorrowedBooks().subscribe({
      next: (res: any) => {
        // console.log('All borrowed books API response:', res);
        this.books = res?.items || res?.data || res || [];
      },
      error: (err) => {
        // console.error('Failed to load all borrowed books:', err);
        this.errorMessage = 'Failed to load all borrowed books.';
      }
    });
  }

  
  returnBook(bookId: number) {
    this.bookService.returnBook(bookId).subscribe({
      next: () => {
        this.successMessage = 'Book returned successfully.';
     
        this.books = this.books.filter(book => book.bookId !== bookId && book.id !== bookId);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        // console.error('Failed to return book:', err);
        this.errorMessage = 'Failed to return book.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }
}
