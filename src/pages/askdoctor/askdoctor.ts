import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { LoginService } from "../../providers/user/islogin";
import { SoruYanitProvider } from '../../providers/soru-yanit/soru-yanit';

@IonicPage()
@Component({
  selector: "page-askdoctor",
  templateUrl: "askdoctor.html"
})
export class AskDoctorPage {
  @ViewChild("myInput") myInput: ElementRef;

  loading: any;
  doctorinfo: any[] = [{}];
  soru: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private islogin: LoginService,
    private soruyanit: SoruYanitProvider
  ) {
    this.doctorinfo[0] = this.navParams.get("doctorinfo");
  }

  ionViewDidLoad() {}

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&soru=" +
      this.soru +
      "&sorantc=" +
      localStorage.getItem("tckimlik") +
      "&yanitlayantc=" +
      this.doctorinfo[0].doktortc;

      this.soruyanit.soruyanit(creds).subscribe(result => {
        if(result.returncode === "0"){

          this.viewCtrl.dismiss(true);
        }
        else {
          this.presentToast(result.message);
        }
      })
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: "Sorunuz Başarıyla Gönderildi",
      subTitle:
        "Dr. " +
        this.doctorinfo[0].name +
        " " +
        this.doctorinfo[0].surname +
        " sorunuzu yanıtladığında bildirim alacaksınız.",
      buttons: ["Tamam"]
    });
    alert.present();
  }

  resize() {
    this.myInput.nativeElement.style.height =
      this.myInput.nativeElement.scrollHeight + "px";
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
