import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,
  AlertController,
  LoadingController,
  ToastController,
  Events } from 'ionic-angular';

import { LoginService } from "../../providers/user/islogin";
import { GetUserProvider } from '../../providers/user/get-user';

@IonicPage()
@Component({
  selector: 'page-secretary-home',
  templateUrl: 'secretary-home.html',
})

export class SecretaryHomePage {

  doctortc: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public islogin: LoginService,
    public toastCtrl: ToastController,
    public events: Events,
    private getuser: GetUserProvider) {

      this.getDoctor();

      this.events.subscribe("doctor:changed", () => {
          this.getDoctor();

      });
  }

  ionViewDidLoad() {
  }

  itemTapped(page) {
    if (page === 1) {
      this.navCtrl.push("PatientListPage");
    }
    if (page === 2) {
      this.navCtrl.push("MessagesPage", { isTab: false, doctortc: this.doctortc });
    }
    if (page === 3) {
      this.navCtrl.push("CalendarPage", { isDoctor: true, doctortc: this.doctortc });
    }
    if (page === 4) {
      this.navCtrl.push("DoctorProfilePage", { doctortc: this.doctortc });
    }
    if (page === 5) {
      this.navCtrl.push("NotificationsPage");
    }
    if (page === 6) {
      this.navCtrl.push("SettingsPage");
    }
    if (page === 7) {
      this.navCtrl.push("ProfilePage");
    }
  }

  getDoctor(){

    var creds2 = "token=" + localStorage.getItem("token") + "&tckimlik=" + localStorage.getItem("tckimlik");

    this.getuser.getUser(creds2).subscribe(result => {

      if(result.returncode === "0"){
        this.doctortc = result.userinfo[0].lastdoctor[0].doktortc;

      }
      else{
        this.presentToast(result.message);
      }

    })

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom",
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }

}
