import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatGuard implements CanActivate {


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afAuth.authState
      .pipe(
        map(user  => user !== null),
        tap(value => {
          // 認証されてない場合
          if (!value) {
            this.router.navigateByUrl('/login').then();
            return value;
          } else {
            return value;
          }
        })
      );
  }



}
