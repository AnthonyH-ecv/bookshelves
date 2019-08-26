import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  getUser = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          firebase.database().ref(user.uid).once('value', (data) => {
            this.getUser = data.val() ? data.val() : [];
          });
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );

  }

  signOut() {
    this.authService.signOut();
  }

}
