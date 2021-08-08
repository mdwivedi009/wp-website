import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from "../../../shared/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { CommonService } from './common.service';
import { Subject, BehaviorSubject, Observable  } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
  user: any = [];
  userID: any;
    private currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('accessToken'));
    public currentUser: Observable<any>;
    public authDetails = new BehaviorSubject<any>(localStorage.getItem('authDetails')).value;

    constructor(
        public router: Router,
        public ngZone: NgZone,
        public afAuth: AngularFireAuth,
        private angularFireAuth: AngularFireAuth,
        private _service: CommonService,
        
    ) {
        this.afAuth.authState.subscribe(user => {
            this.user = user;
        })
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('accessToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // Firebase SignInWithPopup
    OAuthProvider(provider:any) {
        return this.afAuth.signInWithPopup(provider)
            .then(async (res) => {
            const tempData = await this._service.saveAuthTokenInLocalStorage(res.credential);
            const user = await this.afAuth.onAuthStateChanged(user => {
                console.log(user?.uid);
                this.userID = user?.uid;
            });
            await this._service.saveAuthDetails(res.additionalUserInfo?.profile, this.userID)
            await this.currentUserSubject.next(this.currentUserSubject);
            this.ngZone.run(() => {
                this.router.navigate(['/']);
            })
            }).catch((error) => {
                window.alert(error)
            })
    }

    // Firebase Google Sign-in
    SigninWithGoogle() {
        return this.OAuthProvider(new auth.GoogleAuthProvider())
            .then(res => {
                this.ngZone.run(() => {
                  this.router.navigate(['/']);
              })
            }).catch(error => {
                console.log(error)
            });
    }

    // Firebase Logout 
    SignOut() {
      return this.afAuth.signOut().then(() => {
        this._service.clearAuthDetailsFromLocalStorage();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      })
    }

    FacebookAuth() {
        return this.AuthLogin(new auth.FacebookAuthProvider());
    }

    AuthLogin(provider:any) {
        return this.afAuth.signInWithPopup(provider)
        .then(async (result) => {
            await this._service.saveAuthTokenInLocalStorage(result.credential);
            const user = this.afAuth.onAuthStateChanged(user => {
                this.userID = user?.uid;
            });
            await this._service.saveAuthDetails(result.additionalUserInfo?.profile, this.userID)
            this.ngZone.run(() => {
                this.router.navigate(['/']);
            })
            await this.currentUserSubject.next(this.currentUserSubject);
        })
        .catch((error) =>{
            console.log(error);
        })
    }



}