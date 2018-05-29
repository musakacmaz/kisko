import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { LoginService } from "../../../../providers/user/islogin";
import { SoruYanitProvider } from "../../../../providers/soru-yanit/soru-yanit";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-question-details",
  templateUrl: "question-details.html"
})
export class QuestionDetailsPage {

  loading: any;
  id: any;
  question: any[] = [{}];
  rate: any;
  isRated: boolean = false;
  isDoctor: boolean= false;
  answer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public islogin: LoginService,
    public loadingCtrl: LoadingController,
    public events: Events,
    public toastCtrl: ToastController,
    private soruyanit: SoruYanitProvider
  ) {
    this.id = this.navParams.get("id");
    this.isDoctor = this.navParams.get("isDoctor");

    this.getQuestion();
  }

  ionViewDidLoad() {}

  getQuestion() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&soruyanitid=" +
      this.id;

    this.showLoader();

    this.soruyanit.soruyanit(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        this.question[0] = result.soruyanit[0];

        var date = moment(this.question[0].sorutarihi);
        date.locale("tr");
        this.question[0].sorutarihi = moment(date).format("LLL");

        if (this.question[0].yanittarihi !== null) {
          var date2 = moment(this.question[0].yanittarihi);
          date2.locale("tr");
          this.question[0].yanittarihi = moment(date2).format("LLL");

          if (this.question[0].puan === "0") {
            this.isRated = false;
          } else {
            this.isRated = true;
            this.rate = this.question[0].puan;
          }
        }
      } else {
        this.presentToast(result.message);
      }
    });
  }

  rating() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "7" +
      "&soruyanitid=" +
      this.id +
      "&puan=" +
      this.rate;

    this.showLoader();

    this.soruyanit.soruyanit(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        this.isRated = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  sendAnswer(){

    var creds =
    "token=" +
    localStorage.getItem("token") +
    "&action=" +
    "6" +
    "&soruyanitid=" +
    this.id +
    "&yanitlayantc=" +
    localStorage.getItem("tckimlik") +
    "&yanit=" +
    this.answer ;

  this.showLoader();

  this.soruyanit.soruyanit(creds).subscribe(result => {
    this.loading.dismiss();

    if (result.returncode === "0") {
      this.events.publish("answer", true);
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
