import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBorrowedBooks } from './my-borrowed-books';

describe('MyBorrowedBooks', () => {
  let component: MyBorrowedBooks;
  let fixture: ComponentFixture<MyBorrowedBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBorrowedBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBorrowedBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
