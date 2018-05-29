import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { ManuelVisitProvider } from "../../providers/manuel-visit/manuel-visit";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-update-manuel-visit",
  templateUrl: "update-manuel-visit.html"
})
export class UpdateManuelVisitPage {
  loading: any;
  updateInfo: any[] = [
    {
      manuelvizitid: "",
      aciklama: "",
      tarih: "",
      doktor: "",
      kurum: ""
    }
  ];
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private manuel: ManuelVisitProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public events: Events
  ) {
    this.updateInfo[0] = this.navParams.get("updateInfo");

    if (this.updateInfo[0].address === "null") {
      this.updateInfo[0].address = "";
    }
    if (this.updateInfo[0].city === "null") {
      this.updateInfo[0].city = "";
    }
    if (this.updateInfo[0].country === "null") {
      this.updateInfo[0].country = "";
    }
    if (this.updateInfo[0].birthplace === "null") {
      this.updateInfo[0].birthplace = "";
    }
    if (this.updateInfo[0].meslek === "null") {
      this.updateInfo[0].meslek = "";
    }
    if (this.updateInfo[0].email === "null") {
      this.updateInfo[0].email = "";
    }

    this.form = formBuilder.group({
      aciklama: [
        this.updateInfo[0].aciklama,
        Validators.compose([Validators.required])
      ],
      tarih: [
        this.updateInfo[0].tarih,
        Validators.compose([Validators.required])
      ],
      doktor: [
        this.updateInfo[0].doktor,
        Validators.compose([Validators.required])
      ],
      kurum: [
        this.updateInfo[0].kurum,
        Validators.compose([Validators.required])
      ]
    });
  }

  ionViewDidLoad() {}

  updateManuelVisit() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.updateInfo[0].aciklama = this.form.get("aciklama").value;
      this.updateInfo[0].tarih = this.form.get("tarih").value;
      this.updateInfo[0].doktor = this.form.get("doktor").value;
      this.updateInfo[0].kurum = this.form.get("kurum").value;

      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "2" +
        "&manuelvizitid=" +
        this.updateInfo[0].manuelvizitid +
        "&aciklama=" +
        this.updateInfo[0].aciklama +
        "&tarih=" +
        this.updateInfo[0].tarih +
        "&doktor=" +
        this.updateInfo[0].doktor +
        "&kurum=" +
        this.updateInfo[0].kurum;

      this.showLoader();

      this.manuel.manuel(creds).subscribe(
        result => {

          this.loading.dismiss();
          if (result.returncode === "0") {
            this.events.publish('manuel', true);
            this.navCtrl.pop();
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
      } else if (!this.form.controls.tarih.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.doktor.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.kurum.valid) {
        this.presentInvalidToast(4);
      }
    }
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
        message: "Lütfen geçerli bir tarih giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 3) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir doktor giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir kurum giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    }
  }
}
