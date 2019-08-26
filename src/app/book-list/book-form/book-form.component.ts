import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookModel } from 'src/app/models/book';
import * as firebase from 'firebase';
import { UserModel } from 'src/app/models/user';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  getUser: UserModel;

  constructor(private formBuilder: FormBuilder,
              private bookService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          firebase.database().ref(user.uid).once('value', (data) => {
            this.getUser = data.val() ? data.val() : [];
          });
        }
      }
    );
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  onSave() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const owner = this.getUser.firstName;
    const newBook = new BookModel(title, author, owner);
    if (this.fileUrl && this.fileUrl !== '') {
      newBook.photo = this.fileUrl;
    }
    this.bookService.addBook(newBook);
    this.router.navigate(['/books']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.bookService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  detectFile(event) {
    this.onUploadFile(event.target.files[0]);
  }

}
