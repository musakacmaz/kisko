import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { LoginService } from "../../../providers/user/islogin";
import { SoruYanitProvider } from "../../../providers/soru-yanit/soru-yanit";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-questions",
  templateUrl: "questions.html"
})
export class QuestionsPage {
  loading: any;
  questions: any[] = [{}];
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public islogin: LoginService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private soruyanit: SoruYanitProvider
  ) {
    this.getQuestions();
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
      "&sorantc=" +
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

  itemTapped(id) {
    this.navCtrl.push("QuestionDetailsPage", {id: id});
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
