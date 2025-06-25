import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

interface EditableBook {
  id: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.html'
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  borrowedBooks: any[] = [];
  isAdmin = false;
  isLoggedIn = false;
  errorMessage = '';
  editModeId: number | null = null;
  editBookData: EditableBook = { id: 0, name: '', quantity: 0 };

  constructor(
    private bookService: BookService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
      this.isLoggedIn = this.auth.isLoggedIn(); 
    this.loadBooks();
    this.loadBorrowedBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        const books = res.items || res || [];
      this.books = books.map((book: any) => ({
        ...book,
        imageUrl: book.imageUrl || 'https://picsum.photos/200/300' 
      }));
        
      },
      error: (err) => {
        this.errorMessage = 'Failed to load books.';
        console.error(err);
      }
    });
  }

  loadBorrowedBooks(): void {
    this.bookService.getMyBorrowedBooks().subscribe({
      next: (res: any) => {
        this.borrowedBooks = res?.items || res?.data||res || [];
          console.log('Borrowed books:', this.borrowedBooks); 
          console.log(' Borrowed books from API:', res);
      },
      error: () => {
        this.borrowedBooks = [];
      }
    });
  }

  hasBorrowedThisBook(bookId: number): boolean {
    return this.borrowedBooks.some(book => book.bookId === bookId || book.id === bookId);
  }

hasAnyBorrowedBook(): boolean {
  return this.borrowedBooks.length > 0;
}


borrow(id: number) {
  if (this.hasAnyBorrowedBook()) {
    alert('Return your current borrowed book first.');
    return;
  }

  this.bookService.borrowBook(id).subscribe({
    next: () => {
      this.loadBooks();
      this.loadBorrowedBooks();
    },
    error: () => alert('Borrow failed.')
  });
}

return(id: number) {
  this.bookService.returnBook(id).subscribe({
    next: () => {
      this.loadBooks();           // restore quantity
      this.loadBorrowedBooks();   // refresh borrowed state
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

  startEdit(book: any) {
    this.editModeId = book.id;
    this.editBookData = {
      id: book.id,
      name: book.name,
      quantity: book.quantity
    };
  }

  cancelEdit() {
    this.editModeId = null;
    this.editBookData = { id: 0, name: '', quantity: 0 };
  }

 saveEdit() {
  if (!this.editBookData.id || this.editBookData.quantity < 1 || this.editBookData.name.length < 3) {
    alert('Please provide valid book details');
    return;
  }

  const updatedBook = {
    bookId: this.editBookData.id, 
    name: this.editBookData.name.trim(),
    quantity: this.editBookData.quantity,
    isDeleted: false
  };

  this.bookService.updateBook(updatedBook).subscribe({
    next: (res: any) => {
      if (res?.isSuccess) {
        this.loadBooks();
        this.cancelEdit();
      } else {
        alert(res?.message || 'Failed to update book.');
      }
    },
    error: (err) => {
      console.error('Failed to update:', err);
      alert('Update failed. Please try again.');
    }
  });
}

}
