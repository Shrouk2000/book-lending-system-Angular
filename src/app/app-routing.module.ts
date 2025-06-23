import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookList } from './pages/book-list/book-list';
import { LoginComponent } from './pages/login/login';

const routes: Routes = [
  { path: '', component: BookList },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}