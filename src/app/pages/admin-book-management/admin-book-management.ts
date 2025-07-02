import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BookService } from '../../services/book.service';

@Component({
  standalone: true,
  selector: 'app-admin-book-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-book-management.html',
  styleUrl:'./admin-book-management.css'
})
export class AdminBookManagementComponent implements OnInit {
 
  book = {
    name: '',
    quantity: 0,
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    description: '',
    coverImageUrl: ''
  };
currentPage = 1;
pageSize = 10;

  books: any[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  addBook(form: NgForm) {

    if (this.book.name.trim().length < 3) {
      this.showMessage('Name must be at least 3 characters.', 'error');
      return;
    }

    this.bookService.addBook(this.book).subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);
        this.showMessage('Book added successfully!', 'success');
        form.resetForm({
          publishedYear: new Date().getFullYear(),
          quantity: 0
        });
        this.loadBooks();
      },
      error: (err) => {
        // console.error('Add book error:', err);
        this.showMessage('Failed to add book. Please try again.', 'error');
      }
    });
  }

  loadBooks() {
  this.bookService.getAllBooks(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.books = res?.items || res || [];
      },
      error: () => {
        this.showMessage('Failed to load books.', 'error');
      }
    });
  }

  deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.showMessage('Book deleted successfully!', 'success');
          this.loadBooks();
        },
        error: () => this.showMessage('Failed to delete book.', 'error')
      });
    }
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 4000);
  }
}
