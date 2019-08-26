import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bookshelves2';

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCUl68pQqixvWSjCMGysM5KrMp3ANDC7Ic',
      authDomain: 'bookshelves-1173a.firebaseapp.com',
      databaseURL: 'https://bookshelves-1173a.firebaseio.com',
      projectId: 'bookshelves-1173a',
      storageBucket: 'bookshelves-1173a.appspot.com',
      messagingSenderId: '29586977524',
      appId: '1:29586977524:web:539aa4bc6201dfb2'
    };
    firebase.initializeApp(firebaseConfig);

  }
}
