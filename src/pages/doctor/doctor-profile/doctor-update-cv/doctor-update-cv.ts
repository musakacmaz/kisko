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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DoktorProvider } from "../../../../providers/doktor/doktor";

@IonicPage()
@Component({
  selector: "page-doctor-update-cv",
  templateUrl: "doctor-update-cv.html"
})
export class DoctorUpdateCvPage {
  form: FormGroup;
  submitAttempt: boolean = false;
  loading: any;
  doctorinfo: any[] = [
    {
      aciklama: "",
      mezuniyettarihi: "",
      uzmanliktarihi: "",
      mezuniyetkurumu: "",
      uzmanlikkurumu: ""
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
      unvan: [
        this.doctorinfo[0].unvan
      ],
      mezuniyettarihi: [
        this.doctorinfo[0].mezuniyettarihi
      ],
      uzmanliktarihi: [
        this.doctorinfo[0].uzmanliktarihi
      ],
      mezuniyetkurumu: [
        this.doctorinfo[0].mezuniyetkurumu
      ],
      uzmanlikkurumu: [
        this.doctorinfo[0].uzmanlikkurumu
      ]
    });
  }

  ionViewDidLoad() {}

  update() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.doctorinfo[0].mezuniyettarihi = this.form.get(
        "mezuniyettarihi"
      ).value;
      this.doctorinfo[0].uzmanliktarihi = this.form.get("uzmanliktarihi").value;
      this.doctorinfo[0].mezuniyetkurumu = this.form.get(
        "mezuniyetkurumu"
      ).value;
      this.doctorinfo[0].uzmanlikkurumu = this.form.get("uzmanlikkurumu").value;
      this.doctorinfo[0].unvan = this.form.get("unvan").value;

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
        "&unvan=" +
        this.doctorinfo[0].unvan;

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
      } else if (!this.form.controls.mezuniyettarihi.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.uzmanliktarihi.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.mezuniyetkurumu.valid) {
        this.presentInvalidToast(4);
      } else if (!this.form.controls.uzmanlikkurumu.valid) {
        this.presentInvalidToast(5);
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
        message: "Lütfen geçerli bir açıklama giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 2) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir mezuniyet tarihi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 3) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir uzmanlık tarihi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir mezuniyet kurumu giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 5) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir uzmanlık kurumu giriniz.",
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
