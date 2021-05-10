import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;
import {Router} from '@angular/router';
import auth = firebase.auth;
import UserCredential = firebase.auth.UserCredential;
// import {auth} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  // 1 Authentication
  // 2 Storing the route param value, room/:id -> id value

  private pathParamState = new BehaviorSubject<string>('');
  pathParam: Observable<string>;

  // angular fire user

  private user: User;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route: Router
  ) {
    this.pathParam = this.pathParamState.asObservable();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.route.navigateByUrl('').then();
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  loginWithGoogle(): void{
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(
      (data: UserCredential): void => {
        if (data.user){
          this.user = data.user;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.route.navigateByUrl('').then();
        } else {
          localStorage.setItem('user' , null);
        }
      }
    );
  }

  logout(): void{
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.route.navigateByUrl('/login').then();
    });
  }

  updatePathParamState(newPathParam: string): void{
    this.pathParamState.next(newPathParam);
  }

  getUser(): User{
    return this.user;
  }

}


export interface RoomData{
  name: string;
  id?: string;
}

