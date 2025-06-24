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
    const userId = this.authService.getUserId(); // get ID from JWT
    const body = { userId, bookId };
    return this.http.post(`${this.baseUrl}/BorrowBook/Borrow`, body);
    // return this.http.post(`${this.baseUrl}/BorrowBook/Borrow?bookId=${bookId}&userId=${userId}`, {});

  }


  returnBook(bookId: number): Observable<any> {
    const userId=this.authService.getUserId(); //get logged in user's Id
    return this.http.put(
      `${this.baseUrl}/BorrowBook/ReturnBook?bookId=${bookId}&userId=${userId}`,
      {}
    );
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Book/GetBook?bookId=${id}`);
  }

getMyBorrowedBooks(): Observable<any[]> {
  const userId = this.authService.getUserId();
  
  console.log(userId);
  return this.http.get<any[]>(
    `https://booklending-api-raghda-test.jahezteam.com/api/BorrowBook/DisplayNotReturnbooksforOneMember?userId=${userId}`
  );
}





  addBook(book: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Book`, book);
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
