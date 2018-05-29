import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController,
  Events,
  PopoverController
} from "ionic-angular";
import { LogOutProvider } from "../../providers/auth/log-out";
import { LoginService } from "../../providers/user/islogin";
import { ChangePasswordProvider } from "../../providers/auth/change-password";
import { DoktorSekreterProvider } from "../../providers/doktor-sekreter/doktor-sekreter";

@IonicPage()
@Component({
  selector: "page-account",
  templateUrl: "account.html"
})
export class AccountPage {
  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    private logOut: LogOutProvider,
    public islogin: LoginService,
    public popoverCtrl: PopoverController,
    private changePass: ChangePasswordProvider,
    private doktorsekreter: DoktorSekreterProvider
  ) {}

  ionViewDidLoad() {}

  doChangePasswordPrompt() {
    let alert = this.alertCtrl.create({
      title: "Şifre Değiştirme",
      message: "Lütfen yeni şifrenizi girin",
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder: "Yeni Şifreniz",
          value: ""
        }
      ],
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Tamam",
          handler: () => {
            this.doChangePassword(alert.data.inputs[0].value);
          }
        }
      ]
    });

    alert.present({ keyboardClose: false });
  }

  doChangePassword(password) {
    var creds =
      "token=" + localStorage.getItem("token") + "&password=" + password;
    this.showLoader();
    this.changePass.changePassword(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.presentToast(result.message);
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  showPatientConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Hasta moduna geçmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",

          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.openPatientMode();
          }
        }
      ]
    });
    confirm.present();
  }

  openPatientMode() {
    this.islogin.tabIcon = "megaphone";
    this.islogin.tabTitle = "Kayıtlarım";
    this.events.publish("doctor2patient", true);
    this.islogin.role = "patient";
    this.islogin.secondrole = "doctor";
    localStorage.setItem("secondrole", "doctor");
    this.navCtrl.setRoot("HomePage");
    this.navCtrl.popToRoot();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Çıkış yapmak istediğinize emin misiniz?",
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

  showDoctorConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Doktor moduna geçmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.openDoctorMode();
          }
        }
      ]
    });
    confirm.present();
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create("ProfilePopoverPage", {});

    popover.present({
      ev: ev
    });
  }

  openDoctorMode() {
    this.islogin.tabIcon = "calendar";
    this.islogin.tabTitle = "Profil";
    this.events.publish("patient2doctor", true);
    localStorage.setItem("role", "doctor");
    this.islogin.role = "doctor";
    this.islogin.secondrole = "patient";
    this.navCtrl.setRoot("DoctorHomePage");
    this.navCtrl.popToRoot();
  }

  doLogOut() {
    var creds = "token=" + localStorage.getItem("token");
    this.showLoader();
    this.logOut.logout(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          localStorage.clear();
          this.islogin.loginState = false;
          this.islogin.tabIcon = "megaphone";
          this.islogin.tab3Root = "BeklemeOdasiPage";
          this.islogin.avatar = "";
          this.islogin.isLoaded = false;
          this.navCtrl.setRoot("HomePage");
          this.navCtrl.popToRoot();
        } else {
          localStorage.clear();
          this.islogin.loginState = false;
          this.islogin.tabIcon = "megaphone";
          this.islogin.tab3Root = "BeklemeOdasiPage";
          this.islogin.avatar = "";
          this.islogin.isLoaded = false;
          this.navCtrl.setRoot("HomePage");
          this.navCtrl.popToRoot();
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({});

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
        this.presentToast(result.message);
      } else {
        this.presentToast(result.message);
      }
    });
  }
}
