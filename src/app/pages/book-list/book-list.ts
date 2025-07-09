import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

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
  message?: string;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent implements OnInit, AfterViewInit {
  @ViewChild('editBookModal') editBookModal!: ElementRef;
  modalInstance: any;

  @ViewChild('deleteConfirmModal') deleteConfirmModal!: ElementRef;
  deleteModalInstance: any;
  selectedBookToDelete: EditableBook | null = null;

  books: EditableBook[] = [];
  borrowedBooks: any[] = [];
  isAdmin = false;
  isLoggedIn = false;
  errorMessage = '';
  successMessage = '';

  editBookData: EditableBook = {
    id: 0, name: '', quantity: 0, author: '', isbn: '',
    publishedYear: 0, description: '', coverImageUrl: '', isAvailable: false
  };

  currentPage = 1;
  pageSize = 10;
  totalCount: number = 0;

  constructor(
    private bookService: BookService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.getRole() === 'Admin';
    this.isLoggedIn = this.auth.isLoggedIn();
    this.loadBorrowedBooks(() => this.loadBooks());
  }

  ngAfterViewInit(): void {
    if (this.editBookModal) {
      this.modalInstance = new bootstrap.Modal(this.editBookModal.nativeElement);
    }
    if (this.deleteConfirmModal) {
      this.deleteModalInstance = new bootstrap.Modal(this.deleteConfirmModal.nativeElement);
    }
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
          isAvailable: book.quantity > 0,
          message: ''
        }));
        this.totalCount = res.totalCount || 0;
      },
      error: () => this.showMessage('error', 'Failed to load books.')
    });
  }

  loadBorrowedBooks(callback?: () => void): void {
    this.bookService.getMyCurrentlyBorrowedBooks().subscribe({
      next: (res: any) => {
        const allBooks = res?.items || res?.data || res || [];
        const filteredBooks = allBooks.filter((book: any) =>
          book.statusBook !== 'Returned' && book.statusBook !== 'returned'
        );

        this.borrowedBooks = filteredBooks.map((book: any) => book.bookId || book.id);

        if (callback) callback();
      },
      error: () => {
        this.borrowedBooks = [];
        if (callback) callback();
      }
    });
  }

  hasBorrowedThisBook(bookId: number): boolean {
    return this.borrowedBooks.includes(bookId);
  }

  hasAnyBorrowedBook(): boolean {
    return this.borrowedBooks.length > 0;
  }

  handleBorrowOrReturn(book: EditableBook) {
    if (!this.isLoggedIn) {
      book.message = 'Please log in to borrow books.';
      this.clearBookMessageAfterDelay(book);
      this.router.navigate(['/login']);
      return;
    }

    if (this.hasBorrowedThisBook(book.id)) {
      this.return(book.id);
    } else {
      if (this.hasAnyBorrowedBook()) {
        book.message = 'You cannot borrow another book until you return your current borrowed book.';
        this.clearBookMessageAfterDelay(book);
        return;
      }

      this.borrow(book.id);
    }
  }

  borrow(id: number) {
    this.bookService.borrowBook(id).subscribe({
      next: () => {
        const book = this.books.find(b => b.id === id);
        if (book) {
          book.quantity -= 1;
          book.isAvailable = book.quantity > 0;
          book.message = 'Book borrowed successfully.';

          this.loadBorrowedBooks();
          this.clearBookMessageAfterDelay(book);
        }
      },
      error: () => {
        const book = this.books.find(b => b.id === id);
        if (book) {
          book.message = 'Borrow failed.';
          this.clearBookMessageAfterDelay(book);
        }
      }
    });
  }

  return(id: number) {
    this.bookService.returnBook(id).subscribe({
      next: () => {
        const book = this.books.find(b => b.id === id);
        if (book) {
          book.quantity += 1;
          book.isAvailable = book.quantity > 0;
          book.message = 'Book returned successfully.';

          this.loadBorrowedBooks();
          this.clearBookMessageAfterDelay(book);
        }
      },
      error: () => {
        const book = this.books.find(b => b.id === id);
        if (book) {
          book.message = 'Failed to return book.';
          this.clearBookMessageAfterDelay(book);
        }
      }
    });
  }

  clearBookMessageAfterDelay(book: EditableBook) {
    setTimeout(() => {
      book.message = '';
    }, 5000);
  }

  openEditModal(book: EditableBook) {
    this.editBookData = { ...book };
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  saveEdit() {
    if (
      !this.editBookData.id ||
      !this.editBookData.name.trim() ||
      !this.editBookData.author.trim() ||
      !this.editBookData.isbn.trim() ||
      !this.editBookData.publishedYear ||
      !this.editBookData.coverImageUrl.trim() ||
      !this.editBookData.description.trim() ||
      this.editBookData.quantity < 1
    ) {
      this.showMessage('error', 'All fields are required and quantity must be at least 1.');
      return;
    }

    const updatedBook = {
      bookId: this.editBookData.id,
      name: this.editBookData.name.trim(),
      quantity: this.editBookData.quantity,
      author: this.editBookData.author.trim(),
      isbn: this.editBookData.isbn.trim(),
      publishedYear: this.editBookData.publishedYear,
      description: this.editBookData.description.trim(),
      coverImageUrl: this.editBookData.coverImageUrl.trim(),
      isDeleted: false
    };

    this.bookService.updateBook(updatedBook).subscribe({
      next: (res: any) => {
        if (res?.isSuccess) {
          this.loadBooks();
          this.showMessage('success', 'Book updated successfully.');
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        } else {
          this.showMessage('error', res?.message || 'Failed to update book.');
        }
      },
      error: () => {
        this.showMessage('error', 'Update failed. Please try again.');
      }
    });
  }

  confirmDeleteBook(book: EditableBook) {
    this.selectedBookToDelete = book;
    if (this.deleteModalInstance) {
      this.deleteModalInstance.show();
    }
  }

  deleteBookConfirmed() {
    if (!this.selectedBookToDelete) return;

    this.bookService.deleteBook(this.selectedBookToDelete.id).subscribe({
      next: () => {
        this.showMessage('success', 'Book deleted successfully.');
        this.loadBooks();
        this.selectedBookToDelete = null;
        if (this.deleteModalInstance) this.deleteModalInstance.hide();
      },
      error: () => {
        this.showMessage('error', 'Failed to delete book.');
        if (this.deleteModalInstance) this.deleteModalInstance.hide();
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
      if (type === 'success') this.successMessage = '';
      else this.errorMessage = '';
    }, 3000);
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
