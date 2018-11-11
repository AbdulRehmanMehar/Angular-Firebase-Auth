import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { elementStyleProp } from '@angular/core/src/render3';


interface User {
  uid: any;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user = null;
  public authstate;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe(async auth => { // tslint:disable-line
      this.authstate = auth;
      if (auth && await this.dbExists(auth.uid) === false) { // If User is not in db => create User
        return this.setUserData(auth);
      }
    });
  }

  socialLogin(provider: string) {
    let service: any;
    if (provider === 'google') {
      service = new auth.GoogleAuthProvider();
    } else if (provider === 'facebook') {
      service = new auth.FacebookAuthProvider();
    } else if (provider === 'twitter') {
      service = new auth.TwitterAuthProvider();
    } else {
      return false;
    }

    this.afAuth.auth.signInWithPopup(service)
      .then(crdentials => {
        this.authstate = crdentials.user;
      }).catch(error => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          const existingEmail = error.email;
          return this.afAuth.auth.fetchProvidersForEmail(existingEmail)
            .then((providers) => {
              let service_old = null; // already registered service
              service.setCustomParameters({ 'login_hint': existingEmail });
              if (providers.indexOf(auth.GoogleAuthProvider.PROVIDER_ID) !== -1) {
                service_old = new auth.GoogleAuthProvider();
              } else if (providers.indexOf(auth.FacebookAuthProvider.PROVIDER_ID) !== -1) {
                service_old = new auth.FacebookAuthProvider();
              } else if (providers.indexOf(auth.TwitterAuthProvider.PROVIDER_ID) !== -1) {
                service_old = new auth.TwitterAuthProvider();
              } else {
                service_old = null;
              }

              if (service) { // check if social login
                this.afAuth.auth.signInWithPopup(service_old)
                  .then(crdentials => {
                    this.authstate = crdentials.user;
                    this.afAuth.auth.currentUser.linkWithPopup(service);
                  }).catch(err => console.log(err));
              }

            });
        }
      });
  }


  private async dbExists(uid) {
    return await this.afs.doc('users/' + uid).ref.get()
      .then(doc => {
        if (doc.exists) {
          return true;
        } else {
          return false;
        }
      });
  }


  private setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      phone: user.phone || null,
      address: user.address || null,
      isAdmin: false,
    };

    return userRef.set(data, { merge: true });
  }

  logout() {
    this.afAuth.auth.signOut();
  }



}
