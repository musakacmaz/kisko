import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DoctorsMainPage } from '../doctors/doctors-main';
import { HealthMainPage } from '../health/health-main';
import { PharmacyPage } from '../pharmacy/pharmacy';
import { EmergencyPage } from '../emergency/emergency';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { LoginService } from '../../providers/user/islogin';

import { LogOutProvider } from '../../providers/auth/log-out';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  avatar: any
  loading: any
  logoutinfo: any

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, private logOut: LogOutProvider, public islogin: LoginService) {

    this.isLoggedIn();

  }

  ionViewDidLoad() {
  }

  itemTapped(page) {
    if(page === 1)
      {
        this.navCtrl.push(DoctorsMainPage);
      }
    if(page === 2)
      {
        this.navCtrl.push(HealthMainPage);
      }
    if(page === 3)
      {
        this.navCtrl.push(PharmacyPage);
      }
      if(page === 4)
      {
        this.navCtrl.push(EmergencyPage);
      }
    if(page === 5)
      {
        if(!localStorage.getItem("loginsuccess"))
          {
            this.navCtrl.push(LoginPage);
          }
        else
          {
            this.navCtrl.push(ProfilePage);
          }

      }

  }

  isLoggedIn(){
    if(localStorage.getItem("loginsuccess"))
      {
        this.islogin.loginState = true
      }
  }

  doLogOut(){

    var creds = "token=" + localStorage.getItem("token");
    this.showLoader();
    this.logOut.logout(creds).subscribe((result) => {
    this.loading.dismiss();
    this.logoutinfo = result;

        if(this.logoutinfo.success === true)
        {
          localStorage.clear();
          this.islogin.loginState = false;
          this.navCtrl.popToRoot();
          this.presentSuccessToast();
          console.log("user logged out!");
        }
        else{
          this.presentErrToast2();
        }


    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

   showConfirm(){

    let confirm = this.alertCtrl.create({
      title: 'Çıkış yapmak istediğinize emin misiniz?',
      buttons: [
        {
          text: 'Vazgeç',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Evet, eminim',
          handler: () => {
            this.doLogOut();
            console.log('agree clicked');
          }
        }
      ]
    });
    confirm.present();

  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Bilgileriniz kontrol ediliyor...'
    });

    this.loading.present();
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

  presentErrToast2() {
    let toast = this.toastCtrl.create({
      message: 'Henüz giriş yapmadınız!',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Başarıyla çıkış yaptınız',
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
