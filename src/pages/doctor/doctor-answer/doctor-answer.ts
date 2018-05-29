import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { SoruYanitProvider } from "../../../providers/soru-yanit/soru-yanit";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-doctor-answer",
  templateUrl: "doctor-answer.html"
})
export class DoctorAnswerPage {

  loading: any;
  questions: any[] = [{}];
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private soruyanit: SoruYanitProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {

    this.getQuestions();

    this.events.subscribe("answer", result => {
      if (result === true) {
        this.getQuestions();
      }
    });
  }

  ionViewDidLoad() {}

  doRefresh(refresher) {
    this.getQuestions();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getQuestions() {

    var creds =
    "token=" +
    localStorage.getItem("token") +
    "&action=" +
    "4" +
    "&yanitlayantc=" +
    localStorage.getItem("tckimlik");

    this.showLoader();

  this.soruyanit.soruyanit(creds).subscribe(result => {
    this.loading.dismiss();

    if (result.returncode === "0") {
      for (var i = 0; i < result.soruyanit.length; i++) {
        this.questions[i] = result.soruyanit[i];

        var date = moment(this.questions[i].sorutarihi);
        date.locale("tr");
        this.questions[i].sorutarihi = moment(date).format("LLL");
      }
    }
    else if(result.returncode === "4"){
      this.isEmpty = true;
    } else {
      this.presentToast(result.message);
    }
  });
  }

  itemTapped(id){

    this.navCtrl.push("QuestionDetailsPage", {id: id, isDoctor: true});



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
