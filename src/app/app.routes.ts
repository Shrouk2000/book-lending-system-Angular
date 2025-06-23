import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'login', component: LoginComponent },
 { path: 'register', component: RegisterComponent },
];
