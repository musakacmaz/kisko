import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController
} from "ionic-angular";
import { VisitYorumProvider } from "../../../../providers/visit-yorum/visit-yorum";

import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-doctor-comment",
  templateUrl: "doctor-comment.html"
})
export class DoctorCommentPage {
  comments: any[] = [{ star: "", isShow: "" }];
  loading: any;

  star: any = 0;
  Arr = Array;

  isEmpty: boolean = false;

  doctortc: any;

  isSecretary: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private visityorum: VisitYorumProvider
  ) {
    if (localStorage.getItem("role") === "secretary") {
      this.isSecretary = true;
      this.doctortc = this.navParams.get("doctortc");
      this.getComments();
    } else {
      this.doctortc = localStorage.getItem("tckimlik");
      this.getComments();
    }
  }

  ionViewDidLoad() {}

  getComments() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.showLoader();

    this.visityorum.visityorum(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          for (var i = 0; i < result.vizityorum.length; i++) {
            this.comments[i] = result.vizityorum[i];

            var date = moment(this.comments[i].tarih);
            date.locale("tr");
            this.comments[i].tarih = moment(date).fromNow();

            this.comments[i].star = 5 - this.comments[i].star;

            if (this.comments[i].onay === "0") {
              this.comments[i].isShow = false;
            } else if (this.comments[i].onay === "1") {
              this.comments[i].isShow = true;
            }
          }
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else if (result.returncode === "4") {
          this.isEmpty = true;
        } else {
          this.toastCtrl.create(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
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

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      message: "Yeniden giriş yapmak ister misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Tamam",
          handler: () => {
            this.navCtrl.push("LoginPage");
          }
        }
      ]
    });

    alert.present();
  }

  changeApply(hastatc, vizityorumid, vizitid, puan, yorumtext, isShow) {
    var onay;

    if (isShow) {
      onay = "1";
    } else if (!isShow) {
      onay = "0";
    }

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&doktortc=" +
      this.doctortc +
      "&hastatc=" +
      hastatc +
      "&vizityorumid=" +
      vizityorumid +
      "&vizitid=" +
      vizitid +
      "&puan=" +
      puan +
      "&yorumtext=" +
      yorumtext +
      "&onay=" +
      onay;

    this.visityorum.visityorum(creds).subscribe(result => {
      if (result.returncode === "0") {
      } else {
        this.presentToast(result.message);
      }
    });
  }
}
