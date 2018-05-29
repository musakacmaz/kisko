import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  ViewController,
  AlertController
} from "ionic-angular";
import { KilavuzProvider } from "../../../providers/kilavuz/kilavuz";

@IonicPage()
@Component({
  selector: "page-guide-details",
  templateUrl: "guide-details.html"
})
export class GuideDetailsPage {
  guideId: any;
  loading: any;

  isFinished: boolean = false;
  questions: any[] = [
    {
      kid: "",
      id: "",
      parent: "",
      content: ""
    }
  ];

  answers: any[] = [
    {
      kid: "",
      id: "",
      parent: "",
      content: ""
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private kilavuz: KilavuzProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.guideId = this.navParams.get("guide_id");
    this.doGetGuide(this.guideId, 0);
  }

  ionViewDidLoad() {}

  doGetGuide(guide_id, answer_id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&kilavuzid=" +
      guide_id +
      "&yanitid=" +
      answer_id;

    this.showLoader();
    this.kilavuz.getQuestion(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.loading.dismiss();

        this.questions = result.soru;
        this.answers = result.yanitlar;
      } else {
        this.loading.dismiss();
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

    toast.onDidDismiss(() => {});

    toast.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Kılavuzdan çıkmak istediğinize emin misiniz?",
      message:
        "Kılavuz henüz tamamlanmadı, yine de kılavuzdan çıkmak istiyor musunuz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Çıkmak İstiyorum",
          handler: () => {
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }
}
