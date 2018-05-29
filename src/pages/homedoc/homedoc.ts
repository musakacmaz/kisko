import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RecordpatientPage } from './recordpatient/recordpatient';
import { EmuayenePage } from './emuayene/emuayene';
import { CvPage } from './cv/cv';
import { SupportPage } from './support/support'

import { HomePage } from '../home/home';
import { LoginService } from '../../providers/user/islogin';
import { LogOutProvider } from '../../providers/auth/log-out';


@Component({
  selector: 'page-homedoc',
  templateUrl: 'homedoc.html',
})
export class HomedocPage {

  loading: any
  logoutinfo: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private logOut: LogOutProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
  public islogin: LoginService, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomedocPage');
  }

itemTapped(page) {
    if(page === 1)
      {
        this.navCtrl.push(RecordpatientPage);
      }
    if(page === 2)
      {
        this.navCtrl.push(EmuayenePage);
      }
      if(page === 3)
      {
        this.navCtrl.push(CvPage);
      }
       if(page === 4)
      {
        this.navCtrl.push(SupportPage);
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
              this.navCtrl.setRoot(HomePage);
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
}
