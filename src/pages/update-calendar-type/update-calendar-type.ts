import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { RandevuTipiProvider } from "../../providers/randevu-tipi/randevu-tipi";

@IonicPage()
@Component({
  selector: "page-update-calendar-type",
  templateUrl: "update-calendar-type.html"
})
export class UpdateCalendarTypePage {
  loading: any;
  typeinfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private randevutipi: RandevuTipiProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events
  ) {
    this.typeinfo = this.navParams.get("type");
  }

  ionViewDidLoad() {}

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&randevutipiid=" +
      this.typeinfo.randevutipiid +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&isim=" +
      this.typeinfo.isim +
      "&sure=" +
      this.typeinfo.sure +
      "&renk=" +
      this.typeinfo.renk;
    this.showLoader();

    this.randevutipi.randevutipi(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        this.events.publish("randevutipi", true);
        this.viewCtrl.dismiss();
      } else {
        this.presentToast(result.message);
      }
    });
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
    });

    toast.present();
  }
}
