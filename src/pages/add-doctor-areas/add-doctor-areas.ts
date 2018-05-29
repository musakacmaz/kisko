import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  Events
} from "ionic-angular";
import { DoktorSahaProvider } from "../../providers/doktor-saha/doktor-saha";

@IonicPage()
@Component({
  selector: "page-add-doctor-areas",
  templateUrl: "add-doctor-areas.html"
})
export class AddDoctorAreasPage {

  areainfo = {
    sahaadi: "",
    sahatipi: "",
    sirano: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public events: Events,
    public viewCtrl: ViewController,
    private doktorsaha: DoktorSahaProvider
  ) {}

  ionViewDidLoad() {}

  save() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sahaadi=" +
      this.areainfo.sahaadi +
      "&sahatipi=" +
      this.areainfo.sahatipi +
      "&sirano=" +
      this.areainfo.sirano;

    this.doktorsaha.doktorsaha(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.events.publish("doctorarea", true);
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
