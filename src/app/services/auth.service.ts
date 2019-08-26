import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UserModel } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }

  signUp(email: string, password: string, user: UserModel) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
          () => {
            const id = firebase.auth().currentUser.uid;
            this.newUser(user, id);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signIn(email: string, password: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
          () => {
            resolve();
        },
        (error) => {
          reject(error);
        }
        );
      }
    );
  }

  signOut() {
    firebase.auth().signOut();
  }

  newUser(user: UserModel, id: string) {
    return firebase.database().ref(id).set(user);
  }

}
