import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { MyBorrowedBooksComponent } from './my-borrowed-books/my-borrowed-books/my-borrowed-books';
import { AdminBookManagementComponent } from './pages/admin-book-management/admin-book-management';
export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'login', component: LoginComponent },
 { path: 'register', component: RegisterComponent },
  { path: 'borrowed', component: MyBorrowedBooksComponent },
   { path: 'admin', component: AdminBookManagementComponent },
   
];
