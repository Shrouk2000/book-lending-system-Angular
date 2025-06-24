import { Routes } from '@angular/router';
import { HomeComponent } from './components/homePage/home-page/home-page';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { MyBorrowedBooksComponent } from './my-borrowed-books/my-borrowed-books/my-borrowed-books';
import { AdminBookManagementComponent } from './pages/admin-book-management/admin-book-management';
import { BookListComponent } from './pages/book-list/book-list';
import { BookDetailsComponent } from './pages/bookDetails/book-details/book-details';
export const routes: Routes = [
 { path: '', component: HomeComponent },  
  { path: 'book-list', component: BookListComponent },
    { path: 'details/:id', component: BookDetailsComponent },
  { path: 'login', component: LoginComponent },
 { path: 'register', component: RegisterComponent },
  { path: 'borrowed', component: MyBorrowedBooksComponent },
   { path: 'admin', component: AdminBookManagementComponent },
   
];
