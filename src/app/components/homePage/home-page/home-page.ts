import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  errorMessage = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        this.books = res.items || res || [];
        console.log(res)
      },
      error: () => {
        this.errorMessage = 'Unable to load books.';
      }
    });
  }
}
