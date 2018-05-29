import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ManuelVisitProvider } from "../../providers/manuel-visit/manuel-visit";
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: "page-add-manuel-visit",
  templateUrl: "add-manuel-visit.html"
})
export class AddManuelVisitPage {
  loading: any;
  visitinfo = {
    aciklama: "",
    tarih: "",
    doktor: "",
    kurum: ""
  };
  form: FormGroup;
  submitAttempt: boolean = false;

  isDoctor: boolean = false;

  hastatc: any;

  today = moment().format("YYYY-MM-DD");
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private manuel: ManuelVisitProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public events: Events
  ) {
    this.form = formBuilder.group({
      aciklama: [
        "",
        Validators.compose([Validators.maxLength(40), Validators.required])
      ],
      tarih: [
        this.today,
        Validators.compose([Validators.maxLength(30), Validators.required])
      ],
      doktor: ["", Validators.compose([Validators.required])],
      kurum: ["", Validators.compose([Validators.required])]
    });

    if (navParams.get("isDoctor")) {
      this.isDoctor = true;
      this.hastatc = navParams.get("hastatc");
    } else if (!navParams.get("isDoctor")) {
      this.isDoctor = false;
    }
  }

  ionViewDidLoad() {}

  addManuelVisit() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.visitinfo.aciklama = this.form.get("aciklama").value;
      this.visitinfo.tarih = this.form.get("tarih").value;
      this.visitinfo.doktor = this.form.get("doktor").value;
      this.visitinfo.kurum = this.form.get("kurum").value;

      var creds;

      if (this.isDoctor) {
        creds =
          "token=" +
          localStorage.getItem("token") +
          "&action=" +
          "1" +
          "&aciklama=" +
          this.visitinfo.aciklama +
          "&tarih=" +
          this.visitinfo.tarih +
          "&doktor=" +
          this.visitinfo.doktor +
          "&kurum=" +
          this.visitinfo.kurum +
          "&hastatc=" +
          this.hastatc;
      } else if (!this.isDoctor) {
        creds =
          "token=" +
          localStorage.getItem("token") +
          "&action=" +
          "1" +
          "&aciklama=" +
          this.visitinfo.aciklama +
          "&tarih=" +
          this.visitinfo.tarih +
          "&doktor=" +
          this.visitinfo.doktor +
          "&kurum=" +
          this.visitinfo.kurum +
          "&hastatc=" +
          localStorage.getItem("tckimlik");
      }

      this.showLoader();
      this.manuel.manuel(creds).subscribe(
        result => {
          this.loading.dismiss();
          if (result.returncode === "0") {
            this.events.publish('manuel', true);
            this.presentToast(result.message);
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

  showLoader() {
    this.loading = this.loadingCtrl.create({});

    this.loading.present();
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
