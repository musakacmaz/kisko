import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { GetUserProvider } from '../../providers/user/get-user';


import { UpdateProfilePage } from '../profile/update-profile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {

  loading: any

  userInfo: {
    name: '',
    surname: '',
    address: '',
    city: '',
    country: '',
    gender: '',
    birthdate: '',
    birthplace: '',
    email: '',
    cellphone: ''
  };


  deleteinfo: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private getUser: GetUserProvider,
  public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {

      this.doGetUser(localStorage.getItem("token"));
    }

  doGetUser(token){

    var creds = "token=" + token;
    this.showLoader();
    this.getUser.getUser(creds).subscribe((result) => {
    this.loading.dismiss();

    if(result.success === true){

        this.userInfo = result.userinfo;

      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

  goUpdateUser(){

    this.navCtrl.push(UpdateProfilePage, {updateInfo: this.userInfo});

  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
        content: 'Bilgileriniz hazırlanıyor...'
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

  presentErrToast() {
    let toast = this.toastCtrl.create({
      message: 'Kullanıcı bilgisine erişilemedi!',
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

