import { Component } from '@angular/core';
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
  title = '';
  description = '';
  quantity = 1;

  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private bookService: BookService) {}

  addBook(form: NgForm) {
    const trimmedTitle = this.title.trim();
    const qty = +this.quantity;

    if (trimmedTitle.length < 3 || qty < 1) {
      this.showMessage('❌ Title must be at least 3 characters and quantity ≥ 1', 'error');
      return;
    }

    const book = {
      Title: trimmedTitle,
      Description: this.description || '',
      Quantity: qty,
      IsAvailable: true
    };

    console.log('📦 Sending:', book);

    this.bookService.addBook(book).subscribe({
      next: (res: any) => {
        console.log('📥 API Response:', res);
        if (res?.isSuccess === true) {
          this.showMessage('✅ Book added successfully!', 'success');
          form.resetForm();
        } else {
          this.showMessage(`⚠️ ${res?.message || 'Failed to add book.'}`, 'error');
        }
      },
      error: (err) => {
        console.error('❌ Network or server error:', err);
        this.showMessage('❌ Request failed. Please try again.', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 4000);
  }
}
