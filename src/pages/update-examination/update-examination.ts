import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { MuayeneProvider } from "../../providers/muayene/muayene";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DoktorSahaVeriProvider } from "../../providers/doktor-saha-veri/doktor-saha-veri";
import { DoktorSahaProvider } from "../../providers/doktor-saha/doktor-saha";
@IonicPage()
@Component({
  selector: "page-update-examination",
  templateUrl: "update-examination.html"
})
export class UpdateExaminationPage {
  loading: any;
  examination: any[] = [
    {
      muayeneid: "",
      tarih: "",
      oyku: "",
      yakinma: "",
      bulgular: "",
      tani: "",
      aciklama: "",
      sonuc: "",
      kontroltarihi: " ",
      kontrol: ""
    }
  ];

  form: FormGroup;
  submitAttempt: boolean = false;

  selectOptions: any;

  areas: any[] = [{ deger1: "", doktorsahaveriid: "" }];
  isEmptyArea: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private muayene: MuayeneProvider,
    public formBuilder: FormBuilder,
    public events: Events,
    private doktorsahaveri: DoktorSahaVeriProvider,
    private doktorsaha: DoktorSahaProvider
  ) {
    this.selectOptions = {
      title: "Muayene Tipi Seçiniz"
    };

    this.examination[0] = this.navParams.get("examination");

    this.form = formBuilder.group({
      tarih: [
        this.examination[0].tarih,
        Validators.compose([Validators.required])
      ],
      oyku: [this.examination[0].oyku],
      yakinma: [this.examination[0].yakinma],
      bulgular: [this.examination[0].bulgular],
      tani: [this.examination[0].tani],
      aciklama: [this.examination[0].aciklama],
      sonuc: [this.examination[0].sonuc],
      muayenetipi: [this.examination[0].muayenetipi],
      kontrol: [this.examination[0].kontrol],
      kontroltarihi: [this.examination[0].kontroltarihi]
    });

    this.getAreasById();
  }

  ionViewDidLoad() {}

  updateExamination() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.examination[0].tarih = this.form.get("tarih").value;
      this.examination[0].oyku = this.form.get("oyku").value;
      this.examination[0].yakinma = this.form.get("yakinma").value;
      this.examination[0].bulgular = this.form.get("bulgular").value;
      this.examination[0].tani = this.form.get("tani").value;
      this.examination[0].aciklama = this.form.get("aciklama").value;
      this.examination[0].sonuc = this.form.get("sonuc").value;
      this.examination[0].muayenetipi = this.form.get("muayenetipi").value;
      this.examination[0].kontrol = this.form.get("kontrol").value;
      this.examination[0].kontroltarihi = this.form.get("kontroltarihi").value;

      if(this.examination[0].kontroltarihi = "null"){
        this.examination[0].kontroltarihi = "";
      }

      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "2" +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&muayeneid=" +
        this.examination[0].muayeneid +
        "&tarih=" +
        this.examination[0].tarih +
        "&oyku=" +
        this.examination[0].oyku +
        "&bulgular=" +
        this.examination[0].bulgular +
        "&tani=" +
        this.examination[0].tani +
        "&aciklama=" +
        this.examination[0].aciklama +
        "&sonuc=" +
        this.examination[0].sonuc +
        "&muayenetipi=" +
        this.examination[0].muayenetipi +
        "&belgeid=" +
        this.examination[0].belgeid +
        "&yakinma=" +
        this.examination[0].yakinma +
        "&kontroltarihi=" +
        this.examination[0].kontroltarihi +
        "&kontrol=" +
        this.examination[0].kontrol;

        console.log(creds);

      this.showLoader();

      this.muayene.muayene(creds).subscribe(
        result => {
          this.loading.dismiss();
          if (result.returncode === "0") {

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
      if (!this.form.controls.tarih.valid) {
        this.presentInvalidToast(1);
      } else if (!this.form.controls.oyku.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.bulgular.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.ontani.valid) {
        this.presentInvalidToast(4);
      } else if (!this.form.controls.kesintani.valid) {
        this.presentInvalidToast(5);
      } else if (!this.form.controls.aciklama.valid) {
        this.presentInvalidToast(5);
      } else if (!this.form.controls.sonuc.valid) {
        this.presentInvalidToast(7);
      } else if (!this.form.controls.muayenetipi.valid) {
        this.presentInvalidToast(8);
      }
    }

    this.updateAreas();
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

  showLoader() {
    this.loading = this.loadingCtrl.create({});

    this.loading.present();
  }

  presentInvalidToast(errorcode) {
    if (errorcode === 1) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir tarih giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 2) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir öykü giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 3) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir bulgu giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir ön tanı giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir kesin tanı giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir açıklama giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir sonuç giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir muayene tipi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    }
  }

  updateAreas() {
    for (var i = 0; i < this.areas.length; i++) {
      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "2" +
        "&muayeneid=" +
        this.examination[0].muayeneid +
        "&doktorsahaveriid=" +
        this.areas[i].doktorsahaveriid +
        "&deger1=" +
        this.areas[i].deger1 +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&sahaid=" +
        this.areas[i].doktorsahaid;

      this.doktorsahaveri.doktorsahaveri(creds).subscribe(
        result => {
          if (result.returncode === "0") {}
        },
        err => {
          this.presentToast(err);
        }
      );
    }
    this.events.publish("examination", true);
  }

  getAreasById() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.doktorsaha.doktorsaha(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          for (var i = 0; i < result.doktorsaha.length; i++) {
            this.areas[i] = result.doktorsaha[i];
          }
          var creds =
            "token=" +
            localStorage.getItem("token") +
            "&action=" +
            "4" +
            "&muayeneid=" +
            this.examination[0].muayeneid;

          this.doktorsahaveri.doktorsahaveri(creds).subscribe(
            result => {
              if (result.returncode === "0") {
                for (var i = 0; i < result.muayenenotu.length; i++) {
                  for (var j = 0; j < this.areas.length; j++) {
                    if (
                      result.muayenenotu[i].sahaid ===
                      this.areas[j].doktorsahaid
                    ) {
                      this.areas[j].deger1 = result.muayenenotu[i].deger1;
                      this.areas[j].doktorsahaveriid =
                        result.muayenenotu[i].doktorsahaveriid;
                    }
                  }
                }
              } else {
                this.presentToast(result.message);
              }
            },
            err => {
              this.presentToast(err);
            }
          );
        } else if (result.returncode === "4") {
          this.isEmptyArea = true;
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }
}
