import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  Events
} from "ionic-angular";
import { SahaProvider } from "../../providers/saha/saha";

@IonicPage()
@Component({
  selector: "page-add-measurement",
  templateUrl: "add-measurement.html"
})
export class AddMeasurementPage {
  hastatc: any;

  isDoctor: boolean;

  areainfo = {
    sahaadi: "",
    sahatipi: "1",
    birimi: "",
    boyut: "1"
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public events: Events,
    public viewCtrl: ViewController,
    private saha: SahaProvider
  ) {
    this.isDoctor = this.navParams.get("isDoctor");
    this.hastatc = this.navParams.get("hastatc");
  }

  ionViewDidLoad() {}

  addArea() {
    var creds;

    if (this.isDoctor) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&hastatc=" +
        this.hastatc +
        "&sahaadi=" +
        this.areainfo.sahaadi +
        "&sahatipi=" +
        this.areainfo.sahatipi +
        "&birimi=" +
        this.areainfo.birimi +
        "&boyut=" +
        this.areainfo.boyut;
    } else if (!this.isDoctor) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&hastatc=" +
        localStorage.getItem("tckimlik") +
        "&sahaadi=" +
        this.areainfo.sahaadi +
        "&sahatipi=" +
        this.areainfo.sahatipi +
        "&birimi=" +
        this.areainfo.birimi +
        "&boyut=" +
        this.areainfo.boyut;
    }

    this.saha.saha(creds).subscribe(result => {
      if (result.returncode === "0") {
        if (this.isDoctor) {
          this.events.publish("area", this.hastatc);
        } else if (!this.isDoctor) {
          this.events.publish("area", true);
        }

        this.viewCtrl.dismiss();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  cancel() {
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
