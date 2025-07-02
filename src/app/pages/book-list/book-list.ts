import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

interface EditableBook {
  id: number;
  name: string;
  quantity: number;
  author: string;
  isbn: string;
  publishedYear: number;
  description: string;
  coverImageUrl: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl:'./book-list.css',
})
export class BookListComponent implements OnInit {
  books: EditableBook[] = [];
  borrowedBooks: any[] = [];
  isAdmin = false;
  isLoggedIn = false;
  errorMessage = '';
  editModeId: number | null = null;
  editBookData: EditableBook = {
    id: 0, name: '', quantity: 0, author: '', isbn: '',
    publishedYear: 0, description: '', coverImageUrl: '',isAvailable: false 
  };


  currentPage = 1;
  pageSize = 10;
totalCount: number = 0;
  constructor(
    private bookService: BookService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
    this.isLoggedIn = this.auth.isLoggedIn();

this.bookService.getAllBooks(2, 10).subscribe(res => {
  this.loadBooks();
  // console.log('Page 2 Books:', res);
});

    this.loadBorrowedBooks(() => {
      this.loadBooks();
    });
  }


loadBooks(pageNumber: number = this.currentPage): void {
  this.bookService.getAllBooks(pageNumber, this.pageSize).subscribe({
    
    next: (res: any) => {
      const books = res.items || [];
      this.books = books.map((book: any) => ({
        id: book.id,
        name: book.name,
        quantity: book.quantity,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        description: book.description,
        coverImageUrl: book.coverImageUrl || 'https://dummyimage.com/150x220/cccccc/000000&text=No+Image',
        isAvailable: book.quantity > 0
      }));
      this.totalCount = res.totalCount || 0;
    },
    error: (err) => {
      this.errorMessage = 'Failed to load books.';
    }
  });
}


 loadBorrowedBooks(callback?: () => void): void {
  this.bookService.getMyCurrentlyBorrowedBooks().subscribe({
    next: (res: any) => {
      const allBooks = res?.items || res?.data || res || [];
     
      this.borrowedBooks = allBooks.filter((book: any) =>
        book.statusBook !== 'Returned' && book.statusBook !== 'returned'
      );
      if (callback) callback();
    },
    error: () => {
      this.borrowedBooks = [];
      if (callback) callback();
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
    alert('You cannot borrow another book until you return your current borrowed book.');
    return;
  }

  this.bookService.borrowBook(id).subscribe({
    next: () => {
      alert('Book borrowed successfully.');
      this.loadBorrowedBooks(() => {
       
        const borrowedBook = this.books.find(b => b.id === id);
        if (borrowedBook) {
          borrowedBook.quantity -= 1;
          borrowedBook.isAvailable = borrowedBook.quantity > 0;
        }
        this.loadBooks(); 
      });
    },
    error: () => alert('Borrow failed.')
  });
}


return(id: number) {
  const userId = this.auth.getUserId();

  this.bookService.returnBook(id).subscribe({
    next: () => {
      alert('Book returned successfully.');
      this.loadBorrowedBooks(() => {
        
        const returnedBook = this.books.find(b => b.id === id);
        if (returnedBook) {
          returnedBook.quantity += 1;
          returnedBook.isAvailable = returnedBook.quantity > 0;
        }
        this.loadBooks(); 
      });
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

  startEdit(book: EditableBook) {
    this.editModeId = book.id;
    this.editBookData = { ...book };
  }

  cancelEdit() {
    this.editModeId = null;
    this.editBookData = {
      id: 0, name: '', quantity: 0, author: '', isbn: '',
      publishedYear: 0, description: '', coverImageUrl: '', isAvailable: false
    };
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
      author: this.editBookData.author,
      isbn: this.editBookData.isbn,
      publishedYear: this.editBookData.publishedYear,
      description: this.editBookData.description,
      coverImageUrl: this.editBookData.coverImageUrl,
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
        // console.error('Failed to update:', err);
        alert('Update failed. Please try again.');
      }
    });
  }

  // Pagination
  get pagedBooks() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.books.slice(start, end);
  }

get totalPages() {
  return Math.ceil(this.totalCount / this.pageSize);
}

  get pagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadBooks(this.currentPage); 
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadBooks(this.currentPage); 
  }
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.loadBooks(this.currentPage); 
  }
}

}
