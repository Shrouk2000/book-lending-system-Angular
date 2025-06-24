import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'https://booklending-api-raghda-test.jahezteam.com/api/Book';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBooks`);
  }

  borrowBook(bookId: number): Observable<any> {
    return this.http.post(
      `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/Borrow?bookId=${bookId}`,
      {}
    );
  }

  returnBook(bookId: number): Observable<any> {
    return this.http.put(
      `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/ReturnBook?bookId=${bookId}`,
      {}
    );
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetBook?id=${id}`);
  }

getMyBorrowedBooks(): Observable<any[]> {
  return this.http.get<any[]>(
    `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/DisplaybooksforOneMember`
  );
}



  addBook(book: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, book);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?bookId=${bookId}`);
  }
}
