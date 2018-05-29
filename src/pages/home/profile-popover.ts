import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { LoginService } from '../../providers/user/islogin';
import { GetUserRelationUserProvider } from '../../providers/user/get-relation-user';


@IonicPage()
@Component({
  selector: 'profile-popover',
  templateUrl: 'profile-popover.html'
})

export class ProfilePopoverPage {
  relationUser: any[] = [
    {
      tckimlik: '',
      relationtype: '',
      name: '',
      surname: '',
      readpermission: '',
      approved: ''
    }
  ]
  relationInfo: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private getRelation: GetUserRelationUserProvider,
    public islogin: LoginService) {
    this.doGetRelation(localStorage.getItem("token"));
  }
  doGetRelation(token) {

    var creds = "token=" + token;
    this.getRelation.getUser(creds).subscribe((result) => {

      if (result.returncode === "0") {
        for (var index = 0; index < result.relations.length; index++) {
          this.relationUser[index] = result.relations[index];
        }
      }
    }, (err) => {
      this.presentToast(err);
    });

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
