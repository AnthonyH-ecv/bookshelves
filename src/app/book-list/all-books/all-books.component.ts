import { UserModel } from 'src/app/models/user';
import { Component, OnInit } from '@angular/core';
import { BookModel } from 'src/app/models/book';
import { Subscription } from 'rxjs';
import { BooksService } from 'src/app/services/books.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.scss']
})
export class AllBooksComponent implements OnInit {

  books: BookModel[];
  bookSubscribe: Subscription;
  owner = [];
  borrow: boolean;

  constructor(private bookService: BooksService, private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          firebase.database().ref(user.uid).once('value', (data) => {
            this.owner = data.val() ? data.val() : [];
          });
        }
      }
    );
    this.bookSubscribe = this.bookService.allBookSubject.subscribe(
      (book: BookModel[]) => {
        this.books = book;
      }
    );
    this.bookService.getAllBooks();
    this.bookService.emitAllBooks();
  }

  onView(id: number, key: string) {
    this.bookService.comeFrom(key);
    this.router.navigate(['/books', 'view', id]);
  }

  isBorrowBy(book: BookModel, owner: string) {
    this.borrow = true;
    this.bookService.borrow(book, owner);

  }

}
