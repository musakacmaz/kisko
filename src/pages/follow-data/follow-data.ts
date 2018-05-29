import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  ViewController,
  Events
} from "ionic-angular";
import { OlcumTakipProvider } from "../../providers/olcum-takip/olcum-takip";

@IonicPage()
@Component({
  selector: "page-follow-data",
  templateUrl: "follow-data.html"
})
export class FollowDataPage {
  loading: any;
  data_name: any;
  notification: any = "2";
  interaction: any = "1";
  hastatc: any;
  id: any;
  periodtype: any = "3";
  periodvalue: any;

  smaller: any;
  bigger: any;

  params = {
    hastatc: "",
    sahaid: ""
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public events: Events,
    private olcumtakip: OlcumTakipProvider
  ) {
    this.data_name = this.navParams.get("data_name");
    this.hastatc = this.navParams.get("hastatc");
    this.id = this.navParams.get("id");
  }

  ionViewDidLoad() {}

  save() {
    var creds;

    if (this.interaction === "1") {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&hastatc=" +
        this.hastatc +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&sahaid=" +
        this.id +
        "&suretipi=" +
        "4" +
        "&etkilesimtipiid=" +
        "2";

      this.showLoader();

      this.olcumtakip.olcumtakip(creds).subscribe(result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.params.hastatc = this.hastatc;
          this.params.sahaid = this.id;

          this.events.publish("follow", this.params);
          this.viewCtrl.dismiss();
        } else {
          this.presentToast(result.message);
        }
      });
    } else if (this.interaction === "2") {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&hastatc=" +
        this.hastatc +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&sahaid=" +
        this.id +
        "&suretipi=" +
        this.periodtype +
        "&sure=" +
        this.periodvalue +
        "&etkilesimtipiid=" +
        "2";

      this.showLoader();

      this.olcumtakip.olcumtakip(creds).subscribe(result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.params.hastatc = this.hastatc;
          this.params.sahaid = this.id;

          this.events.publish("follow", this.params);
          this.viewCtrl.dismiss();
        } else {
          this.presentToast(result.message);
        }
      });
    } else if (this.interaction === "3") {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&hastatc=" +
        this.hastatc +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&sahaid=" +
        this.id +
        "&suretipi=" +
        "5" +
        "&etkilesimtipiid=" +
        "2" +
        "&kucukse=" +
        this.smaller +
        "&bigger=" +
        this.bigger;

      this.showLoader();

      this.olcumtakip.olcumtakip(creds).subscribe(result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.params.hastatc = this.hastatc;
          this.params.sahaid = this.id;

          this.events.publish("follow", this.params);
          this.viewCtrl.dismiss();
        } else {
          this.presentToast(result.message);
        }
      });
    }
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

  showLoader() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
}
