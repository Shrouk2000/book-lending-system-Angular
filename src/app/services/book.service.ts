import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'https://booklending-api-raghda-test.jahezteam.com/api';

  constructor(private http: HttpClient, private authService: AuthService) {}


getAllBooks(pageNumber: number, pageSize: number) {
  const url = `${this.baseUrl}/Book/GetBooks?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get<any>(url);
  
}


  borrowBook(bookId: number): Observable<any> {
    const userId = this.authService.getUserId();
    const body = { userId, bookId };
    return this.http.post(`${this.baseUrl}/BorrowBook/Borrow`, body);
  }

 returnBook(bookId: number): Observable<any> {
  const userId = this.authService.getUserId();
  console.log('Returning bookId:', bookId, 'for userId:', userId);
  return this.http.put(
    `${this.baseUrl}/BorrowBook/ReturnBook?BookId=${bookId}&userId=${userId}`,
    {},
    { responseType: 'text' }
  );
}

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Book/GetBook?bookId=${id}`);
  }



 getMyCurrentlyBorrowedBooks(): Observable<any[]> {
  const userId = this.authService.getUserId();
  return this.http.get<any>(
    `${this.baseUrl}/BorrowBook/DisplaybooksforOneMember?userId=${userId}`
  ).pipe(
    map(res => res?.items || res || [])
  );
}


  getAllBorrowedBooks(): Observable<any[]> {
    const userId = this.authService.getUserId();

    return this.http.get<any[]>(`${this.baseUrl}/BorrowBook/DisplaybooksforOneMember?userId=${userId}`);
    // console.log(userId)
    
  }

  addBook(book: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Book`, book);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Book?bookId=${bookId}`);
  }

updateBook(book: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/Book?bookId=${book.bookId}`, {
    name: book.name,
    quantity: book.quantity,
    isDeleted: false, 
    author: book.author,
    isbn: book.isbn,
    publishedYear: book.publishedYear,
    description: book.description,
    coverImageUrl: book.coverImageUrl
  });
}



  getAllOverdueBooks(page = 1, pageSize = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/BorrowBook/DisplaybooksOverDue?pageNumber=${page}&pageSize=${pageSize}`);
  }

  getMyOverdueBooks(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.baseUrl}/BorrowBook/DisplayNotReturnbooksforOneMember?userId=${userId}`);
  }
}
