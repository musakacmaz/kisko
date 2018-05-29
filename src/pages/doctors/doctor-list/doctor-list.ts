import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  LoadingController,
  ToastController
} from "ionic-angular";
import { DoktorProvider } from "../../../providers/doktor/doktor";

@IonicPage()
@Component({
  selector: "page-doctor-list",
  templateUrl: "doctor-list.html"
})
export class DoctorListPage {
  doctors: any[] = [{ doktortc: "" }];
  speciality: {};
  bransid: any;
  isOn: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private doktor: DoktorProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.speciality = navParams.get("speciality");
    this.bransid = navParams.get("bransid");
    this.initializeDoctors();
  }

  ionViewDidLoad() {}

  initializeDoctors() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&bransid=" +
      this.bransid;

    this.showLoader();

    this.doktor.doktor(creds).subscribe(result => {
      this.loading.dismiss();
      if (result.returncode === "0") {

        for (var i = 0; i < result.doktor.length; i++) {
          this.doctors[i] = result.doktor[i];
        }
      } else if (result.returncode === "4") {
      } else {
        this.toastCtrl.create(result.message);
      }
    });
  }

  getDoctors(ev) {
    // Reset items back to all of the items
    this.initializeDoctors();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.doctors = this.doctors.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  itemTapped(doctor_name, doctor_surname, doktortc) {
    this.events.publish("doctorprofile", doctor_name);

    this.navCtrl.push("DoctorDetailsPage", {
      doctor_name: doctor_name,
      doctor_surname: doctor_surname,
      doktortc: doktortc
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
  }

  showLoader() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
}
