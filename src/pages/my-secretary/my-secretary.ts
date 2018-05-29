import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  LoadingController
} from "ionic-angular";
import { DoktorSekreterProvider } from "../../providers/doktor-sekreter/doktor-sekreter";

@IonicPage()
@Component({
  selector: "page-my-secretary",
  templateUrl: "my-secretary.html"
})
export class MySecretaryPage {

  secretary: any = [{}];
  isEmptySecretary: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private doktorsekreter: DoktorSekreterProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.getSecretary();
  }

  ionViewDidLoad() {}

  getSecretary() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

      this.showLoader();

      this.doktorsekreter.doktorsekreter(creds).subscribe(result => {

        this.loading.dismiss();

        if(result.returncode === "0"){
          this.secretary[0] = result.doktorsekreter[0];
          this.isEmptySecretary = false;
        }
        else if(result.returncode === "4"){
          this.isEmptySecretary = true;
        }
        else{
          this.presentToast(result.message);
        }
      })
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: "Sekreter Ekle",
      message: "Eklemek istediğiniz sekreterin TC kimlik numarasını giriniz.",
      inputs: [
        {
          name: "tckimlik",
          placeholder: "TC Kimlik No",
          type: "number",
          value: ""
        }
      ],
      buttons: [
        {
          text: "Vazgeç",
          handler: data => {}
        },
        {
          text: "Kaydet",
          handler: data => {
            this.saveSecretary(prompt.data.inputs[0].value);
          }
        }
      ]
    });
    prompt.present();
  }

  saveSecretary(sekretertc) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sekretertc=" +
      sekretertc;

    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.getSecretary();
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

    toast.onDidDismiss(() => {});

    toast.present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Sekreter Silme',
      message: 'Sekreterinizi silmek istediğinize emin misiniz?',
      buttons: [
        {
          text: 'Vazgeç',
          handler: () => {
          }
        },
        {
          text: 'Evet, eminim',
          handler: () => {
            this.deleteSecretary();
          }
        }
      ]
    });
    confirm.present();
  }

  deleteSecretary(){

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sekretertc=" +
      this.secretary[0].sekretertc;

    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.getSecretary();
      } else {
        this.presentToast(result.message);
      }
    });

  }
}
