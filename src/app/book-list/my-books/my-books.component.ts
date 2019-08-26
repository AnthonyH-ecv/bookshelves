import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookModel } from '../../models/book';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';


@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: BookModel[];
  bookSubscribe: Subscription;

  constructor(private bookService: BooksService, private router: Router) { }

  ngOnInit() {
    this.bookSubscribe = this.bookService.bookSubject.subscribe(
      (book: BookModel[]) => {
        this.books = book;
      }
    );
    this.bookService.getBooks();
    this.bookService.emitBooks();
  }

  addBook() {
    this.router.navigate(['/books', 'new']);
  }

  removeBook(book: BookModel) {
    this.bookService.removeBook(book);
  }

  onView(id: number, key: string) {
    this.bookService.comeFrom(key);
    this.router.navigate(['/books', 'view', id]);
  }

  ngOnDestroy() {
    this.bookSubscribe.unsubscribe();
  }
}
