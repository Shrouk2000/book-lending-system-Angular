import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'https://booklending-api-raghda-test.jahezteam.com/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Book/GetBooks`);
  }

  borrowBook(bookId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/BorrowBook/Borrow?bookId=${bookId}`,
      {}
    );
  }

  returnBook(bookId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/BorrowBook/ReturnBook?bookId=${bookId}`,
      {}
    );
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Book/GetBook?id=${id}`);
  }

getMyBorrowedBooks(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/BorrowBook/DisplaybooksforOneMember`
  );
}



  addBook(book: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, book);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Book?bookId=${bookId}`);
  }

updateBook(book: any): Observable<any> {
  return this.http.put(
    `https://booklending-api-raghda-test.jahezteam.com/api/Book?bookId=${book.bookId}`, 
    {
      name: book.name,
      quantity: book.quantity,
      isDeleted: false
    }
  );
}


}
