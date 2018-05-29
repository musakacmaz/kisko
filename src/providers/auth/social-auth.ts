import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class SocialLoginProvider {

  constructor(private fire: AngularFireAuth, public googleplus: GooglePlus) {}

   loginFacebook(){
      let response = this.fire.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      return response;
    }

   loginGoogle(){
      let response = this.fire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      return response;
    }
}



