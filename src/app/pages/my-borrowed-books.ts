import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-my-borrowed-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-borrowed-books.html'
})
export class MyBorrowedBooksComponent implements OnInit {
  books: any[] = [];
  private bookService = inject(BookService);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getMyBorrowedBooks().subscribe({
      next: res => this.books = res,
      error: err => console.error('Error loading borrowed books:', err)
    });
  }

  return(bookId: string) {
    this.bookService.returnBook(bookId).subscribe(() => {
      this.loadBooks();
    });
  }
}
