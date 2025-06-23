import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BookService } from '../../services/book.service';

@Component({
  standalone: true,
  selector: 'app-admin-book-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-book-management.html',
})
export class AdminBookManagementComponent {
  name = '';
  quantity = 1;
 books: any[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private bookService: BookService) {}
ngOnInit():void{
  this.loadBooks();
}
  addBook(form: NgForm) {
    const trimmedname = this.name.trim();
    const qty = +this.quantity;

    if (trimmedname.length < 3 || qty < 1) {
      this.showMessage(' name must be at least 3 characters and quantity ≥ 1', 'error');
      return;
    }

    const book = {
      Name: trimmedname,
    
      Quantity: qty,
      IsAvailable: true
    };

    console.log('Sending:', book);
    console.log(this.name.trim())

    this.bookService.addBook(book).subscribe({
      next: (res: any) => {
        console.log('📥 API Response:', res);
        if (res?.isSuccess === true) {
          this.showMessage(' Book added successfully!', 'success');
          form.resetForm();
        } else {
          this.showMessage(`⚠️ ${res?.message || 'Failed to add book.'}`, 'error');
        }
      },
      error: (err) => {
        console.error(' Network or server error:', err);
        this.showMessage(' Request failed. Please try again.', 'error');
      }
    });
  }
  loadBooks() {
  this.bookService.getAllBooks().subscribe({
    next: (res: any) => {
      this.books = res;
    },
    error: () => {
      this.showMessage(' Failed to load books', 'error');
    }
  });
}

deleteBook(bookId: number) {
  if (confirm('Are you sure you want to delete this book?')) {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.showMessage(' Book deleted!', 'success');
        this.loadBooks(); 
      },
      error: () => this.showMessage(' Failed to delete book', 'error')
    });
  }
}

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 4000);
  }
  
}
