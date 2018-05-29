import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  ToastController,
  LoadingController,
  Events,
  AlertController
} from "ionic-angular";
import { DoktorHastaProvider } from "../../../../providers/doktor-hasta/doktor-hasta";

@IonicPage()
@Component({
  selector: "page-add-patient",
  templateUrl: "add-patient.html"
})
export class AddPatientPage {
  loading: any;
  isNotAvailable: boolean = false;
  doctortc: any;

  patientinfo = {
    hastatc: "",
    name: "",
    surname: "",
    birthdate: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public platform: Platform,
    private doktorhasta: DoktorHastaProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public events: Events
  ) {}

  ionViewDidLoad() {}

  itemTapped() {}

  addPatient() {
    if (!this.isNotAvailable) {
      if (localStorage.getItem("role") === "secretary") {
        this.doctortc = this.navParams.get("doctortc");

        var creds2 =
          "token=" +
          localStorage.getItem("token") +
          "&action=" +
          "1" +
          "&doktortc=" +
          this.doctortc +
          "&hastatc=" +
          this.patientinfo.hastatc;

        this.showLoader();

        this.doktorhasta.doktorhasta(creds2).subscribe(
          result => {
            this.loading.dismiss();
            if (result.returncode === "0") {
              this.events.publish("patient", true);
              this.navCtrl.pop();
            } else if (result.returncode === "4") {
              this.presentAlert();
              this.isNotAvailable = true;
            } else {
              this.presentToast(result.message);
            }
          },
          err => {
            this.loading.dismiss();
            this.presentToast(err);
          }
        );
      } else {
        var creds =
          "token=" +
          localStorage.getItem("token") +
          "&action=" +
          "1" +
          "&doktortc=" +
          localStorage.getItem("tckimlik") +
          "&hastatc=" +
          this.patientinfo.hastatc;

        this.showLoader();

        this.doktorhasta.doktorhasta(creds).subscribe(
          result => {
            this.loading.dismiss();
            if (result.returncode === "0") {
              this.events.publish("patient", true);
              this.navCtrl.pop();
            } else if (result.returncode === "4") {
              this.presentAlert();
              this.isNotAvailable = true;
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
    } else {
      this.addPatientWithParams();
    }
  }

  addPatientWithParams() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&hastatc=" +
      this.patientinfo.hastatc +
      "&name=" +
      this.patientinfo.name +
      "&surname=" +
      this.patientinfo.surname +
      "&birthdate=" +
      this.patientinfo.birthdate;

    this.showLoader();

    this.doktorhasta.doktorhasta(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.events.publish("patient", true);
          this.navCtrl.pop();
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

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: "Dikkat",
      subTitle:
        "Girmiş olduğunuz TC numarası kayıtlarımızda bulunmamaktadır. Yeni kayıt açabilmek için lütfen hastanın nüfus bilgilerini eksiksiz olarak giriniz.",
      buttons: ["Tamam"],
      cssClass: "alert"
    });
    alert.present();
  }
}
