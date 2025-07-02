import { Routes } from '@angular/router';
import { HomePage } from './components/homePage/home-page/home-page';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { MyBorrowedBooksComponent } from './my-borrowed-books/my-borrowed-books/my-borrowed-books';
import { AdminBookManagementComponent } from './pages/admin-book-management/admin-book-management';
import { BookListComponent } from './pages/book-list/book-list';
import { BookDetailsComponent } from './pages/bookDetails/book-details/book-details';
import { DelayedBooksComponent } from './pages/delayed-books/delayed-books';
import { AdminGuard } from './guards/admin-guard';
import { AuthGuard } from './guards/auth-guard';
import { NotFoundComponent } from './pages/not-found/not-found';
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'book-list', component: BookListComponent },
  { path: 'details/:id', component: BookDetailsComponent },

  { path: 'login', component: LoginComponent },
{
  path: 'register',
  loadComponent: () =>
    import('./pages/register/register').then(m => m.RegisterComponent)
},

  {
    path: 'borrowed',
    component: MyBorrowedBooksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminBookManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'delayed-books',
    component: DelayedBooksComponent,
    canActivate: [AdminGuard]
  },

 { path: '**', component: NotFoundComponent },

];
