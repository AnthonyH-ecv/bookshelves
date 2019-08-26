import { Component, OnInit } from '@angular/core';
import { BookModel } from 'src/app/models/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent implements OnInit {

  book: BookModel;

  constructor(private route: ActivatedRoute,
              private bookService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.book = new BookModel('', '', '');
    const id = this.route.snapshot.params.id;
    console.log(this.bookService.nextRoute);
    this.bookService.getSingleBook(+id).then(
      (book: BookModel) => {
        this.book = book;
      }
    );
  }

  onBack() {
    this.router.navigate(['/books']);
  }


}
