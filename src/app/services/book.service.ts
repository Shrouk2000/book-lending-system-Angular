import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = 'https://booklending-api-raghda-test.jahezteam.com/api/Book';

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBooks`);
  }

  borrowBook(bookId: number) {
  return this.http.post(
    `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/Borrow?bookId=${bookId}`,
    {}
  );
}

  // Return a book
returnBook(bookId: number) {
  return this.http.put(
    `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/ReturnBook?bookId=${bookId}`,
    {}
  );
}

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBook?id=${id}`);
  }

  getMyBorrowedBooks(): Observable<any[]> {
    return this.http.get<any[]>('https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/DisplaybooksforOneMember');
  }


addBook(book: any): Observable<any> {
  return this.http.post('https://booklending-api-raghda-test.jahezteam.com/api/Book', book);
}

deleteBook(bookId: number) {
  return this.http.delete(`https://booklending-api-raghda-test.jahezteam.com/api/Book?bookId=${bookId}`);
}
}
