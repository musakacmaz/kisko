import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";

import { LoginService } from "../../providers/user/islogin";
import { LogOutProvider } from "../../providers/auth/log-out";
import { DoktorSekreterProvider } from "../../providers/doktor-sekreter/doktor-sekreter";

@IonicPage()
@Component({
  selector: "page-doctor-home",
  templateUrl: "doctor-home.html"
})
export class DoctorHomePage {
  loading: any;
  logoutinfo: any;

  secretary: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logOut: LogOutProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public islogin: LoginService,
    public toastCtrl: ToastController,
    public events: Events,
    private doktorsekreter: DoktorSekreterProvider
  ) {}

  getSecretary() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.navCtrl.push("MessagesPage", { isTab: false, sekretertc: result.doktorsekreter[0].sekretertc });
      } else if (result.returncode === "4") {
        this.showSecretaryConfirm();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  itemTapped(page) {
    if (page === 1) {
      this.navCtrl.push("PatientListPage");
    }
    if (page === 2) {
      this.navCtrl.push("DoctorProfilePage");
    }
    if (page === 3) {
      this.navCtrl.push("CalendarPage", { isDoctor: true });
    }
    if (page === 4) {
      this.navCtrl.push("NotificationsPage");
    }
    if (page === 5) {
      this.navCtrl.push("AccountPage");
    }
    if (page === 6) {
      this.navCtrl.push("SettingsPage");
    }
    if (page === 7) {
      this.navCtrl.push("DoctorAnswerPage");
    }
    if (page === 8) {
      this.navCtrl.push("DoctorAreasPage");
    }
    if (page === 9) {
      this.navCtrl.push("ProfilePage");
    }
    if (page === 10) {
      this.getSecretary();

    }
  }

  showSecretaryConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Sekreter Bulunamadı",
      message:
        "Kisko Chat modülünü kullanabilmek için bir sekreter eklemek ister misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Tamam",
          handler: () => {
            this.showPrompt();
          }
        }
      ]
    });
    confirm.present();
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: "Sekreter Ekle",
      message: "Eklemek istediğiniz sekreterin TC kimlik numarasını giriniz.",
      inputs: [
        {
          name: "tckimlik",
          placeholder: "TC Kimlik No",
          type: "number",
          value: ""
        }
      ],
      buttons: [
        {
          text: "Vazgeç",
          handler: data => {}
        },
        {
          text: "Kaydet",
          handler: data => {
            this.saveSecretary(prompt.data.inputs[0].value);
          }
        }
      ]
    });
    prompt.present();
  }

  saveSecretary(sekretertc) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sekretertc=" +
      sekretertc;

    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.getSecretary();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  doLogOut() {
    var creds = "token=" + localStorage.getItem("token");
    this.showLoader();
    this.logOut.logout(creds).subscribe(
      result => {
        this.loading.dismiss();
        this.logoutinfo = result;

        if (this.logoutinfo.returncode === "0") {
          localStorage.clear();
          this.islogin.loginState = false;
          this.islogin.tabIcon = "medical";
          this.islogin.tabTitle = "Kayıtlarım";
          this.navCtrl.setRoot("HomePage");
          this.navCtrl.popToRoot();
        } else {
          localStorage.clear();
          this.islogin.loginState = false;
          this.navCtrl.popToRoot();
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Çıkış yapmak istediğinize emin misiniz?",
      mode: "ios",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.doLogOut();
          }
        }
      ]
    });
    confirm.present();
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: "Bilgileriniz kontrol ediliyor..."
    });

    this.loading.present();
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
