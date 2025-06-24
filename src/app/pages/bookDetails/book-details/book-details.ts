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
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook();
  }

  loadBook() {
    this.bookService.getBookById(this.bookId.toString()).subscribe({
      next: (res) => {
        this.book = res;
      },
      error: () => {
        this.errorMessage = 'Failed t o load book details.';
      }
    });
  }
}
