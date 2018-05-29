import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  Events
} from "ionic-angular";

import { RandevuTipiProvider } from "../../providers/randevu-tipi/randevu-tipi";

@IonicPage()
@Component({
  selector: "page-add-calendar-types",
  templateUrl: "add-calendar-types.html"
})
export class AddCalendarTypesPage {
  typeinfo = {
    isim: "",
    sure: "15",
    renk: ""
  };

  colors: any = [{}];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public events: Events,
    public viewCtrl: ViewController,
    private randevutipi: RandevuTipiProvider
  ) {
    this.getColors();
  }

  ionViewDidLoad() {}

  getColors() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&renk=" +
      "1";

    this.randevutipi.randevutipi(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.randevutipi.length; i++) {
          this.colors[i] = result.randevutipi[i];
        }
        this.typeinfo.renk = this.colors[0].renkid;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  save() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&isim=" +
      this.typeinfo.isim +
      "&renk=" +
      this.typeinfo.renk +
      "&sure=" +
      this.typeinfo.sure;

    this.randevutipi.randevutipi(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.events.publish("randevutipi", true);
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
