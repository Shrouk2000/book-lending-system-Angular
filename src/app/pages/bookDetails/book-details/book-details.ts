import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-details.html',
})
export class BookDetailsComponent implements OnInit {
  bookId!: number;
  book: any;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = +idParam;
      this.loadBook();
    } else {
      this.errorMessage = 'Invalid book ID.';
    }
  }

  loadBook() {
    this.bookService.getBookById(this.bookId.toString()).subscribe({
      next: (res) => {
        this.book = res?.data || res;
        console.log(' Loaded book:', this.book);
        // if (this.book) {
        //   if (!this.book.imageUrl) {
        //     this.book.imageUrl = 'https://via.placeholder.com/200x300?text=No+Image';
        //   }
        // } else {
        //   this.errorMessage = 'Book not found.';
        // }
      },
      error: () => {
        this.errorMessage = 'Failed to load book details.';
      }
    });
  }
}
