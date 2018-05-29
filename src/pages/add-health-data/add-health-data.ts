import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events,
  ToastController
} from "ionic-angular";
import { Olcum2Provider } from "../../providers/olcum2/olcum2";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-add-health-data",
  templateUrl: "add-health-data.html"
})
export class AddHealthDataPage {
  today: String = new Date().toISOString();

  measurement = {
    deger1: "",
    deger2: "",
    deger3: "",
    deger4: "",
    olcumzamani: this.today
  };

  id: any;

  data_name: any;
  hastatc: any;
  size: any;

  isDoctor: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    public toastCtrl: ToastController,
    private olcum2: Olcum2Provider
  ) {
    this.id = this.navParams.get("id");
    this.data_name = this.navParams.get("data_name");
    this.size = this.navParams.get("size");
    this.hastatc = this.navParams.get("hastatc");
    this.isDoctor = this.navParams.get("isDoctor");
  }

  ionViewDidLoad() {}

  save() {
    var deger;

    if (this.size === "1") {
      deger = this.measurement.deger1;
    } else if (this.size === "2") {
      deger = this.measurement.deger1 + "," + this.measurement.deger2;
    } else if (this.size === "3") {
      deger =
        this.measurement.deger1 +
        "," +
        this.measurement.deger2 +
        "," +
        this.measurement.deger3;
    } else if (this.size === "4") {
      deger =
        this.measurement.deger1 +
        "," +
        this.measurement.deger2 +
        "," +
        this.measurement.deger3 +
        "," +
        this.measurement.deger4;
    }

    var ekleyentc;

    if (this.isDoctor) {
      ekleyentc = localStorage.getItem("tckimlik");
    } else {
      ekleyentc = this.hastatc;
    }

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&sahaid=" +
      this.id +
      "&hastatc=" +
      this.hastatc +
      "&deger=" +
      deger +
      "&olcumzamani=" +
      this.measurement.olcumzamani +
      "&ekleyentc=" +
      ekleyentc;

    this.olcum2.olcum2(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.events.publish("measurement", this.hastatc);
          this.viewCtrl.dismiss();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        alert(err);
      }
    );
  }

  close() {
    this.viewCtrl.dismiss();
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
