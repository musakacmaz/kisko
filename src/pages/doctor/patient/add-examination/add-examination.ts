import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { MuayeneProvider } from "../../../../providers/muayene/muayene";
import { DoktorSahaVeriProvider } from "../../../../providers/doktor-saha-veri/doktor-saha-veri";
import { DoktorSahaProvider } from "../../../../providers/doktor-saha/doktor-saha";
import { GetUserProvider } from '../../../../providers/user/get-user';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-add-examination",
  templateUrl: "add-examination.html"
})
export class AddExaminationPage {
  selectOptions: any;
  hastatc: any;
  today = moment().format("YYYY-MM-DD");
  loading: any;
  areas: any[] = [{}];
  isEmpty: boolean = false;

  muayeneinfo = {
    tarih: this.today,
    yakinma: "",
    oyku: "",
    bulgular: "",
    tani: "",
    aciklama: "",
    sonuc: "",
    muayenetipi: "1", //1 : normal muayene,  2 : e-muayene
    kontrol: "",
    kontroltarihi: ""
  };

  areainfo = {
    deger1: "",
    deger2: ""
  };

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private muayene: MuayeneProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public events: Events,
    private doktorsahaveri: DoktorSahaVeriProvider,
    private doktorsaha: DoktorSahaProvider,
    private getUser: GetUserProvider
  ) {
    this.hastatc = this.navParams.get("hastatc");

    if(localStorage.getItem("role") === "secretary"){

      var creds2 = "token=" + localStorage.getItem("token") + "&tckimlik=" + localStorage.getItem("tckimlik");

    this.getUser.getUser(creds2).subscribe(result => {

      if(result.returncode === "0"){
        this.doctortc = result.userinfo[0].lastdoctor[0].doktortc;
        this.getAreas();

      }
      else{
        this.presentToast(result.message);
      }

    })

    }
    else{
      this.doctortc = localStorage.getItem("tckimlik");
      this.getAreas();
    }

  }

  ionViewDidLoad() {}

  save() {
    this.navCtrl.pop();
  }

  addMuayene() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&doktortc=" +
      this.doctortc +
      "&hastatc=" +
      this.hastatc +
      "&tarih=" +
      this.muayeneinfo.tarih +
      "&oyku=" +
      this.muayeneinfo.oyku +
      "&bulgular=" +
      this.muayeneinfo.bulgular +
      "&tani=" +
      this.muayeneinfo.tani +
      "&aciklama=" +
      this.muayeneinfo.aciklama +
      "&sonuc=" +
      this.muayeneinfo.sonuc +
      "&muayenetipi=" +
      "1" +
      "&yakinma=" +
      this.muayeneinfo.yakinma +
      "&kontrol=" +
      this.muayeneinfo.kontrol +
      "&kontroltarihi=" +
      this.muayeneinfo.kontroltarihi

    this.showLoader();

    this.muayene.muayene(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.addAreaData(result.muayeneid);
          this.events.publish("examination", true);
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

  getAreas() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.doktorsaha.doktorsaha(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          for (var i = 0; i < result.doktorsaha.length; i++) {
            this.areas[i] = result.doktorsaha[i];
          }
        } else if (result.returncode === "4") {
          this.isEmpty = true;
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }

  addAreaData(muayeneid) {
    for (var i = 0; i < this.areas.length; i++) {
      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&muayeneid=" +
        muayeneid +
        "&doktortc=" +
        this.doctortc +
        "&sahaid=" +
        this.areas[i].doktorsahaid +
        "&deger1=" +
        this.areas[i].deger1 +
        "&deger2=" +
        this.areas[i].deger2;

      this.doktorsahaveri.doktorsahaveri(creds).subscribe(result => {
        if (result.returncode === "0") {
        } else if (result.returncode === "4") {
        } else {
          this.presentToast(result.message);
        }
      });
    }
  }
}
