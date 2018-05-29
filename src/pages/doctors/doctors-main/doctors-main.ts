import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { BransProvider } from "../../../providers/brans/brans";

@IonicPage()
@Component({
  selector: "page-doctors-main",
  templateUrl: "doctors-main.html"
})
export class DoctorsMainPage {
  loading: any;
  specialities;
  isOn: boolean = false;

  branslar: any[] = [
    {
      bransid: "",
      bransadi: ""
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private brans: BransProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.initializeSpecialities();
  }

  ionViewDidLoad() {}

  initializeSpecialities() {
    var creds = "token=" + localStorage.getItem("token") + "&action=" + "4";

    this.showLoader();

    this.brans.brans(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.loading.dismiss();

        for (var i = 0; i < result.brans.length; i++) {
          this.branslar[i] = result.brans[i];
        }
      } else {
        this.loading.dismiss();
        this.toastCtrl.create(result.message);
      }
    });
  }

  getSpecialities(ev) {
    // Reset items back to all of the items
    this.initializeSpecialities();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.branslar = this.branslar.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  itemTapped(speciality, bransid) {
    this.navCtrl.push("DoctorListPage", {
      speciality: speciality,
      bransid: bransid
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

  getButtonText(): string {
    return `Switch ${this.isOn ? "Off" : "On"}`;
  }
  setState(): void {
    this.isOn = !this.isOn;
  }

  toggleDetails() {
    this.isOn = !this.isOn;
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
}
