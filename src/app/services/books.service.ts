import { Injectable } from '@angular/core';
import { BookModel } from '../models/book';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  allBooks: BookModel[] = [];
  books: BookModel[] = [];
  bookSubject = new Subject<BookModel[]>();
  allBookSubject = new Subject<BookModel[]>();
  userId: string;
  nextRoute: string;

  constructor() {
    this.getBooks();
    this.getAllBooks();
  }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  emitAllBooks() {
    this.allBookSubject.next(this.allBooks);
  }

  saveBooks() {
    this.userId = firebase.auth().currentUser.uid;
    firebase.database().ref(this.userId + '/books').set(this.books);
    firebase.database().ref('/books').set(this.allBooks);
  }

  getBooks() {
    this.userId = firebase.auth().currentUser.uid;
    firebase.database().ref(this.userId + '/books')
    .on('value', (data) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    });
  }

  getAllBooks() {
    firebase.database().ref('/books')
    .on('value', (data) => {
      this.allBooks = data.val() ? data.val() : [];
      this.emitAllBooks();
    });
  }

  getSingleBook(id: number) {
    this.userId = firebase.auth().currentUser.uid;
    return new Promise(
      (resolve, reject) => {
        if (this.nextRoute === 'myBooks') {
        firebase.database().ref(this.userId + '/books/' + id).once('value')
        .then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
        } else {
          firebase.database().ref('books/' + id).once('value')
          .then(
            (data) => {
              resolve(data.val());
            },
            (error) => {
              reject(error);
            }
          );
        }
      }
    );
  }

  borrow(book: BookModel) {
    book.borrow = true;
    this.saveBooks();
    this.emitBooks();
    this.emitAllBooks();
  }

  comeFrom(key: string) {
    this.nextRoute = key;
  }

  addBook(book: BookModel) {
    this.books.push(book);
    this.allBooks.push(book);
    this.saveBooks();
    this.emitBooks();
    this.emitAllBooks();
  }

  removeBook(book: BookModel) {
    if (book.photo !== undefined) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('photo deleted');
        }
      ).catch(
        (error) => {
          console.log('file not found:' + error);
        }
      );

    }
    const bookId = this.books.findIndex(
      (item) => {
        if (item === book) {
          return true;
        }
      }
    );

    const allBookId = this.allBooks.indexOf(book);


    this.books.splice(bookId, 1);
    this.allBooks.splice(allBookId - 1, 1);
    this.saveBooks();
    this.emitAllBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueName =  Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + uniqueName + file.name)
          .put(file);
        upload.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('loading...');
          },
          (error) => {
            console.log('error loading:' + error );
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
}
