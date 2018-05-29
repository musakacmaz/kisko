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
import { DoktorProvider } from "../../../../providers/doktor/doktor";

@IonicPage()
@Component({
  selector: "page-doctor-info-update",
  templateUrl: "doctor-info-update.html"
})
export class DoctorInfoUpdatePage {
  form: FormGroup;
  submitAttempt: boolean = false;
  loading: any;
  doctorinfo: any[] = [
    {
      website: "",
      eposta: "",
      tel1: "",
      tel2: "",
      tel3: ""
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
      website: [
        this.doctorinfo[0].website,
        Validators.compose([
          Validators.pattern(
            "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})"
          )
        ])
      ],
      eposta: [
        this.doctorinfo[0].eposta,
        Validators.compose([
          Validators.pattern("^[A-Za-z0-9.]+@[A-Za-z0-9.]+$")
        ])
      ],
      tel1: [this.doctorinfo[0].tel1],
      tel2: [this.doctorinfo[0].tel2],
      tel3: [this.doctorinfo[0].tel3],
      tag: [this.doctorinfo[0].tag],
      adres: [this.doctorinfo[0].adres]
    });
  }

  ionViewDidLoad() {}

  update() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.doctorinfo[0].website = this.form.get("website").value;
      this.doctorinfo[0].eposta = this.form.get("eposta").value;
      this.doctorinfo[0].tel1 = this.form.get("tel1").value;
      this.doctorinfo[0].tel2 = this.form.get("tel2").value;
      this.doctorinfo[0].tel3 = this.form.get("tel3").value;
      this.doctorinfo[0].tag = this.form.get("tag").value;
      this.doctorinfo[0].adres = this.form.get("adres").value;

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
        "&tag=" +
        this.doctorinfo[0].tag +
        "&adres=" +
        this.doctorinfo[0].adres;

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
      if (!this.form.controls.website.valid) {
        this.presentInvalidToast(1);
      } else if (!this.form.controls.eposta.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.tel1.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.tel2.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.tel3.valid) {
        this.presentInvalidToast(3);
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
        message: "Lütfen geçerli bir web sitesi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 2) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir e-posta giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 3) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir telefon numarası giriniz.",
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
