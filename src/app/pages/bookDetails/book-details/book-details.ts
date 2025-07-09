import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetailsComponent implements OnInit {
  bookId!: number;
  book: any;
  borrowedBooks: any[] = [];
  errorMessage = '';
  successMessage = '';
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAdmin = this.auth.getRole() === 'Admin';

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = +idParam;
      this.loadBook();


      if (this.isLoggedIn && !this.isAdmin) {
        this.loadBorrowedBooks();
      }
    } else {
      this.errorMessage = 'Invalid book ID.';
    }
  }

  loadBook() {
    this.bookService.getBookById(this.bookId.toString()).subscribe({
      next: (res) => {
        this.book = res?.data || res;
        if (!this.book) {
          this.errorMessage = 'Book not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load book details.';
      }
    });
  }

  loadBorrowedBooks() {
    this.bookService.getMyCurrentlyBorrowedBooks().subscribe({
      next: (res: any) => {
        const allBooks = res?.items || res?.data || res || [];
        this.borrowedBooks = allBooks.filter((book: any) =>
          book.statusBook !== 'Returned' && book.statusBook !== 'returned'
        );
      },
      error: () => {
        this.borrowedBooks = [];
      }
    });
  }

  hasAnyBorrowedBook(): boolean {
    return this.borrowedBooks.length > 0;
  }

  borrow(id: number) {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.hasAnyBorrowedBook()) {
      this.errorMessage = 'You already have a borrowed book. Return it first.';
      return;
    }

    this.bookService.borrowBook(id).subscribe({
      next: () => {
        this.successMessage = 'Book borrowed successfully.';
        this.loadBorrowedBooks();
      },
      error: () => {
        this.errorMessage = 'Borrow failed. Please try again.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
