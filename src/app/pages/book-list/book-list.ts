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
  borrowedBooks: any[] = [];

  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  constructor(private bookService: BookService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
    this.loadBooks();
    this.loadBorrowedBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        this.books = res.items;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.errorMessage = 'Failed to load books.';
      }
    });
  }

 loadBorrowedBooks(): void {
  this.bookService.getMyBorrowedBooks().subscribe({
    next: (res: any) => {
      console.log('📦 API borrowed books response:', res);
      this.borrowedBooks = res?.items || res || [];
    },
    error: (err) => {
      console.error('Failed to load borrowed books:', err);
      this.borrowedBooks = [];
    }
  });
}

  hasBorrowedThisBook(bookId: number): boolean {
    return this.borrowedBooks.some(b => b.id === bookId);
  }

  hasAnyBorrowedBook(): boolean {
    return this.borrowedBooks.length > 0;
  }

borrow(id: number) {
  if (this.hasAnyBorrowedBook()) {
    alert('You must return your current borrowed book before borrowing another.');
    return;
  }
  const book = this.books.find(b => b.id === id);
  console.log('Trying to borrow:', book);
  this.bookService.borrowBook(id).subscribe({
    next: (res: any) => {
      if (res.isSuccess) {
        this.loadBooks();
        this.loadBorrowedBooks();
      } else {
        if (res.message && res.message.includes('qunitity=0')) {
          alert('Sorry, this book is no longer available.');
        } else {
          alert(res.message || 'Failed to borrow book.');
        }
      }
    },
    error: () => alert('Failed to borrow book.')
  });
}
  return(id: number) {
    this.bookService.returnBook(id).subscribe({
      next: () => {
        this.loadBooks();
        this.loadBorrowedBooks();
      },
      error: () => alert('Failed to return book.')
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
