import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events,
  AlertController
} from "ionic-angular";
import { DoktorProvider } from "../../../../providers/doktor/doktor";

@IonicPage()
@Component({
  selector: "page-doctor-tanitim",
  templateUrl: "doctor-tanitim.html"
})
export class DoctorTanitimPage {
  loading: any;
  doctorinfo: any[] = [{}];

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private doktor: DoktorProvider
  ) {
    if(localStorage.getItem("role") === "secretary"){

      this.doctortc = this.navParams.get("doctortc");
      this.getDoctor();

    }
    else{

      this.doctortc = localStorage.getItem("tckimlik");
      this.getDoctor();

    }
  }

  ionViewDidLoad() {}

  update() {
    this.navCtrl.push("DoctorUpdateCv2Page", {
      doctorinfo: this.doctorinfo[0]
    });
  }

  getDoctor() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.showLoader();

    this.doktor.doktor(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.doctorinfo[0] = result.doktor[0];
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.toastCtrl.create(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  showLoader() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom",
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      message: "Yeniden giriş yapmak ister misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Tamam",
          handler: () => {
            this.navCtrl.push("LoginPage");
          }
        }
      ]
    });

    alert.present();
  }
}
