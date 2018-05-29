import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events,
  AlertController
} from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DoktorProvider } from "../../providers/doktor/doktor";

@IonicPage()
@Component({
  selector: "page-doctor-update-cv2",
  templateUrl: "doctor-update-cv2.html"
})
export class DoctorUpdateCv2Page {
  form: FormGroup;
  submitAttempt: boolean = false;
  loading: any;
  doctorinfo: any[] = [
    {
      aciklama: ""
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private doktor: DoktorProvider
  ) {
    this.doctorinfo[0] = this.navParams.get("doctorinfo");

    this.form = formBuilder.group({
      aciklama: [this.doctorinfo[0].aciklama]
    });
  }

  ionViewDidLoad() {}

  update() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.doctorinfo[0].aciklama = this.form.get("aciklama").value;

      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "2" +
        "&doktortc=" +
        this.doctorinfo[0].doktortc +
        "&kurumid=" +
        this.doctorinfo[0].kurumid +
        "&bransid=" +
        this.doctorinfo[0].bransid +
        "&diplomabelgeid=" +
        this.doctorinfo[0].diplomabelgeid +
        "&mezuniyettarihi=" +
        this.doctorinfo[0].mezuniyettarihi +
        "&uzmanliktarihi=" +
        this.doctorinfo[0].uzmanliktarihi +
        "&mezuniyetkurumu=" +
        this.doctorinfo[0].mezuniyetkurumu +
        "&uzmanlikkurumu=" +
        this.doctorinfo[0].uzmanlikkurumu +
        "&website=" +
        this.doctorinfo[0].website +
        "&eposta=" +
        this.doctorinfo[0].eposta +
        "&aciklama=" +
        this.doctorinfo[0].aciklama +
        "&tel1=" +
        this.doctorinfo[0].tel1 +
        "&tel2=" +
        this.doctorinfo[0].tel2 +
        "&tel3=" +
        this.doctorinfo[0].tel3 +
        "&unvan=" +
        this.doctorinfo[0].unvan +
        "&aciklama=" +
        this.doctorinfo[0].aciklama;

      this.showLoader();

      this.doktor.doktor(creds).subscribe(
        result => {
          this.loading.dismiss();

          if (result.returncode === "0") {
            this.events.publish("doctor:updated", true);
            this.navCtrl.pop();
          } else if (result.returncode === "1") {
            this.doPrompt();
          } else {
            this.presentToast(result.message);
          }
        },
        err => {
          this.loading.dismiss();
          this.presentToast(err);
        }
      );
    } else {
      if (!this.form.controls.aciklama.valid) {
        this.presentInvalidToast(1);
      }
    }
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({});

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

  presentInvalidToast(errorcode) {
    if (errorcode === 1) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir özgeçmiş giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    }
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
}
