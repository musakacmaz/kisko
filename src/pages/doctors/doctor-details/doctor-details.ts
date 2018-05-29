import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  ModalController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { LoginService } from "../../../providers/user/islogin";
import { DomSanitizer } from "@angular/platform-browser";
import { DoktorProvider } from "../../../providers/doktor/doktor";
import { VisitYorumProvider } from "../../../providers/visit-yorum/visit-yorum";
import { MedyaProvider } from "../../../providers/medya/medya";
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-doctor-details",
  templateUrl: "doctor-details.html"
})
export class DoctorDetailsPage {
  loading: any;
  doctor;
  doctor_name: any;
  doctor_surname: any;
  isDoctor: boolean = false;
  doctorName: any;

  doktortc: any;
  doktorinfo: any[] = [{}];
  comments: any[] = [{}];

  commentcounter = 0;

  videos: any = [{}];
  isEmptyVideo: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private islogin: LoginService,
    private events: Events,
    private modalCtrl: ModalController,
    public dom: DomSanitizer,
    private doktor: DoktorProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private visityorum: VisitYorumProvider,
    private medya: MedyaProvider,
    private iab: InAppBrowser,
  ) {
    this.showLoader();
    this.doctor = "hakkında";
    this.doktortc = this.navParams.get("doktortc");
    this.getDoctorInfo();
    this.getComments();
    this.getVideos();
    this.loading.dismiss();
  }

  itemTapped(page) {
    if (page === 1) {
      let modal = this.modalCtrl.create("AskDoctorPage", {
        doctorinfo: this.doktorinfo[0]
      });
      modal.onDidDismiss(data => {
        if(data === true){
          this.navCtrl.push("QuestionsPage");
        }
      })
      modal.present();
    } else if (page === 2) {
      this.navCtrl.push("DoctorMapPage");
    } else if (page === 3) {
      this.navCtrl.push("CalendarPage", { isDoctor: false });
    }
  }

  getDoctorInfo() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doktortc;
    this.doktor.doktor(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.doktorinfo[0] = result.doktor[0];
      } else {
        this.toastCtrl.create(result.message);
      }
    });
  }

  getComments() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doktortc;

    this.visityorum.visityorum(creds).subscribe(
      result => {
        if (result.returncode === "0") {

          for (var i = 0; i < result.vizityorum.length; i++) {

            if(result.vizityorum[i].onay === "1"){
              this.comments[this.commentcounter] = result.vizityorum[i];

              var date = moment(this.comments[this.commentcounter].tarih);
              date.locale("tr");
              this.comments[this.commentcounter].tarih = moment(date).fromNow();

              this.commentcounter = this.commentcounter + 1;
            }

          }
        }
        else if(result.returncode === "4"){
        }
          else {
          this.toastCtrl.create(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }

  getVideos() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&gonderentc=" +
      this.doktortc +
      "&medyatipiid=" +
      "2";

    this.medya.medya(creds).subscribe(result => {

      if (result.returncode === "0") {
        for (var i = 0; i < result.medya.length; i++) {
          this.videos[i] = result.medya[i];

        var date = moment(this.videos[i].gondermetarihi);
        date.locale("tr");
        this.videos[i].gondermetarihi = moment(date).format("LL");
        }
      } else if (result.returncode === "4") {
        this.isEmptyVideo = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  playVideo(url: string){

    const options: InAppBrowserOptions = {
      zoom: "yes"
    };

    const browser = this.iab.create(url, "_system", options);

  }

  trustUrl(url) {
    return this.dom.bypassSecurityTrustResourceUrl(url);
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
