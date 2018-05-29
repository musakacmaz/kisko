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
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-doctor-video",
  templateUrl: "doctor-video.html"
})
export class DoctorVideoPage {
  loading: any;
  doctortc: any;
  videos: any = [{}];
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private medya: MedyaProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private iab: InAppBrowser,
    public events: Events
  ) {
    if (localStorage.getItem("role") === "secretary") {
      this.doctortc = this.navParams.get("doctortc");
      this.getVideos();
    } else {
      this.doctortc = localStorage.getItem("tckimlik");
      this.getVideos();
    }

    this.events.subscribe("video:added", () => {
      this.getVideos();
    })
  }

  ionViewDidLoad() {}

  getVideos() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&gonderentc=" +
      this.doctortc +
      "&medyatipiid=" +
      "2";

    this.showLoader();

    this.medya.medya(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.medya.length; i++) {
          this.videos[i] = result.medya[i];

        var date = moment(this.videos[i].gondermetarihi);
        date.locale("tr");
        this.videos[i].gondermetarihi = moment(date).format("LL");
        }
      } else if (result.returncode === "4") {
        this.isEmpty = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  addVideo() {
    this.navCtrl.push("DoctorVideoAddPage");
  }

  playVideo(url: string){

    const options: InAppBrowserOptions = {
      zoom: "yes"
    };

    const browser = this.iab.create(url, "_system", options);

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
