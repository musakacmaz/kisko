import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { MedyaProvider } from "../../../../providers/medya/medya";

@IonicPage()
@Component({
  selector: "page-doctor-video-add",
  templateUrl: "doctor-video-add.html"
})
export class DoctorVideoAddPage {
  loading: any;

  video: any = {
    url: "",
    title: "",
    description: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medya: MedyaProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events
  ) {}

  ionViewDidLoad() {}

  save() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&medya=" +
      this.video.url +
      "&aciklama=" +
      this.video.description +
      "&baslik=" +
      this.video.title +
      "&gonderentc=" +
      localStorage.getItem("tckimlik") +
      "&medyatipiid=" +
      "2";

    this.showLoader();

    this.medya.medya(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {

        this.events.publish("video:added");
        this.navCtrl.pop();

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
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
