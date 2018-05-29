import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { DoktorHastaProvider } from "../../../../providers/doktor-hasta/doktor-hasta";
import { GetUserProvider } from '../../../../providers/user/get-user';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-patient-list",
  templateUrl: "patient-list.html"
})
export class PatientListPage {
  loading: any;
  isOn: boolean = false;
  isEmpty: boolean = false;
  patients: any[] = [{}];
  searched: any[] = [{}];

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: ActionSheetController,
    public platform: Platform,
    private doktorhasta: DoktorHastaProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    private getUser: GetUserProvider
  ) {
    if(localStorage.getItem("role") === "secretary"){

      var creds2 = "token=" + localStorage.getItem("token") + "&tckimlik=" + localStorage.getItem("tckimlik");

    this.getUser.getUser(creds2).subscribe(result => {

      if(result.returncode === "0"){
        this.doctortc = result.userinfo[0].lastdoctor[0].doktortc;
        this.initializePatients();

      }
      else{
        this.presentToast(result.message);
      }

    })

    }
    else{
      this.doctortc = localStorage.getItem("tckimlik");
      this.initializePatients();
    }


    this.events.subscribe("patient", result => {
      if (result === true) {
        this.initializePatients();
      }
    });
  }

  ionViewDidLoad() {}
  initializePatients() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.showLoader();

    this.doktorhasta.doktorhasta(creds).subscribe(result => {
      this.loading.dismiss();
      if (result.returncode === "0") {
        for (var i = 0; i < result.doktorhasta.length; i++) {
          this.patients[i] = result.doktorhasta[i];
          var date = moment(this.patients[i].tarih);
          date.locale("tr");
          this.patients[i].tarih = moment(date).format("LL");
        }
      } else if (result.returncode === "1") {
        this.doPrompt();
      } else if (result.returncode === "4") {
        this.isEmpty = true;
      } else {
        this.toastCtrl.create(result.message);
      }
    });
  }

  getPatients(ev: any) {
    // Reset items back to all of the items
    //this.initializePatients();

    // set val to the value of the ev target
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.patients = [{}];

      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "5" +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&ara=" +
        val;

      this.doktorhasta.doktorhasta(creds).subscribe(result => {
        if (result.returncode === "0") {
          for (var i = 0; i < result.doktorhasta.length; i++) {
            this.patients[i] = result.doktorhasta[i];
            var date = moment(this.patients[i].tarih);
            date.locale("tr");
            this.patients[i].tarih = moment(date).format("LL");
          }
          this.isEmpty = false;
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else if (result.returncode === "4") {
          this.isEmpty = true;
        } else {
          this.isEmpty = true;
          this.toastCtrl.create(result.message);
        }
      });
    } else if (!val && val.trim() == "") {
      this.initializePatients();
    }
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

    toast.onDidDismiss(() => {});

    toast.present();
  }

  itemTapped(hastatc, patient_name, patient_surname) {
    this.navCtrl.push("PatientInfoPage", {
      type: 1,
      hastatc: hastatc,
      patient_name: patient_name,
      patient_surname: patient_surname
    });
  }

  goAddPatient() {
    this.navCtrl.push("AddPatientPage", {doctortc: this.doctortc});
  }

  doRefresh(refresher) {
    this.initializePatients();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  present() {
    let actionSheet = this.alertCtrl.create({
      title: "Şuna Göre Sırala:",
      buttons: [
        {
          text: "İsime Göre (A-Z)",
          handler: () => {
            this.sortPatients("name", "asc");
          }
        },
        {
          text: "İsime Göre (Z-A)",
          handler: () => {
            this.sortPatients("name", "desc");
          }
        },
        {
          text: "Soyisime Göre (A-Z)",
          handler: () => {
            this.sortPatients("surname", "asc");
          }
        },
        {
          text: "Soyisime Göre (Z-A)",
          handler: () => {
            this.sortPatients("surname", "desc");
          }
        },
        {
          text: "Son Muayene Tarihi (Önce En Yeni)",
          handler: () => {
            this.sortPatients("tarih", "desc");
          }
        },
        {
          text: "Son Muayene Tarihi (Önce En Eski)",
          handler: () => {
            this.sortPatients("tarih", "asc");
          }
        },
        {
          text: "Vazgeç",
          role: "cancel", // will always sort to be on the bottom
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  sortPatients(field, type) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&saha=" +
      field +
      "&siralamatipi=" +
      type;

    this.showLoader();

    this.patients = [{}];

    this.doktorhasta.doktorhasta(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.doktorhasta.length; i++) {
          this.patients[i] = result.doktorhasta[i];
          var date = moment(this.patients[i].tarih);
          date.locale("tr");
          this.patients[i].tarih = moment(date).format("LL");
        }
      } else {
        this.presentToast(result.returncode);
      }
    });
  }

  getButtonText(): string {
    return `Switch ${this.isOn ? "Off" : "On"}`;
  }
  setState(): void {
    this.isOn = !this.isOn;
  }

  toggleDetails() {
    this.isOn = !this.isOn;
    this.initializePatients();
  }

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      subTitle: "Yeniden giriş yapmak ister misiniz?",
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
