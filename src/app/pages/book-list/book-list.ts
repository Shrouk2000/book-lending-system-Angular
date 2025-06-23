import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.html'
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  isLoading = false;
  errorMessage = '';

  private bookService = inject(BookService);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
  this.bookService.getAllBooks().subscribe({
    next: (res: any) => {
      console.log('Books received from API:', res);
      this.books = res.items;
    },
    error: (err) => {
      console.error(' Error fetching books:', err);
    }
  });
}


 borrow(id: string) {
  this.bookService.borrowBook(id).subscribe({
    next: () => {
      this.loadBooks();
    },
    error: () => alert('Failed to borrow book.')
  });
}

return(id: string) {
  this.bookService.returnBook(id).subscribe({
    next: () => {
      this.loadBooks();
    },
    error: () => alert('Failed to return book.')
  });
}

}