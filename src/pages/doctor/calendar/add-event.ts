import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ToastController,
  LoadingController
} from "ionic-angular";
import * as moment from "moment";
import { RandevuProvider } from "../../../providers/randevu/randevu";
import { RandevuTipiProvider } from "../../../providers/randevu-tipi/randevu-tipi";

@IonicPage()
@Component({
  selector: "page-add-event",
  templateUrl: "add-event.html"
})
export class AddEventPage {
  isEmptyType: boolean = false;
  types: any = [{}];

  event = {
    startTime: "",
    endTime: "",
    description: "",
    type: "0",
    duration: ""
  };
  minDate = new Date().toISOString;

  loading: any;

  duration: any;

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private randevu: RandevuProvider,
    private randevutipi: RandevuTipiProvider
  ) {
    this.doctortc = this.navParams.get("doctortc");

    this.getTypes();

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    var randevutipi;

    if (this.isEmptyType) {
      randevutipi = "0";
    } else {
      randevutipi = this.event.type;
    }

    if (this.event.startTime > this.event.endTime) {
      this.presentToast("Lütfen geçerli bir tarih aralığı giriniz.");
    } else {
      if (localStorage.getItem("role") === "secretary") {

        var creds2 =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&doktortc=" +
        this.doctortc +
        "&baslangictarih=" +
        this.event.startTime +
        "&bitistarih=" +
        this.event.endTime +
        "&aciklama=" +
        this.event.description +
        "&randevutipi=" +
        randevutipi +
        "&kayityapantc=" +
        localStorage.getItem("tckimlik");

      this.showLoader();

      this.randevu.randevu(creds2).subscribe(result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.viewCtrl.dismiss(this.event);
        } else {
          this.presentToast(result.message);
        }
      });

      } else {

        var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "1" +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&baslangictarih=" +
        this.event.startTime +
        "&bitistarih=" +
        this.event.endTime +
        "&aciklama=" +
        this.event.description +
        "&randevutipi=" +
        randevutipi +
        "&kayityapantc=" +
        localStorage.getItem("tckimlik");

      this.showLoader();

      this.randevu.randevu(creds).subscribe(result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.viewCtrl.dismiss(this.event);
        } else {
          this.presentToast(result.message);
        }
      });
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

  getTypes() {

    if(localStorage.getItem("role") === "secretary"){

      var creds2 =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.showLoader();

    this.randevutipi.randevutipi(creds2).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.randevutipi.length; i++) {
          this.types[i] = result.randevutipi[i];
        }

        this.event.type = this.types[0].randevutipiid;
        this.event.duration = this.types[0].sure;

        let start = new Date(
          moment(this.navParams.get("selectedDay")).format()
        );
        let end = new Date(moment(this.navParams.get("selectedDay")).format());
        end.setMinutes(end.getMinutes() + this.types[0].sure);
        this.event.startTime = start.toISOString();
        this.event.endTime = end.toISOString();
      } else if (result.returncode === "4") {
        this.isEmptyType = true;
        this.event.type = "-99";
        let start = new Date(
          moment(this.navParams.get("selectedDay")).format()
        );
        let end = new Date(moment(this.navParams.get("selectedDay")).format());
        end.setMinutes(end.getMinutes() + 30);
        this.event.startTime = start.toISOString();
        this.event.endTime = end.toISOString();
      } else {
        this.presentToast(result.message);
      }
    });

    }
    else{

      var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.showLoader();

    this.randevutipi.randevutipi(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.randevutipi.length; i++) {
          this.types[i] = result.randevutipi[i];
        }

        this.event.type = this.types[0].randevutipiid;
        this.event.duration = this.types[0].sure;

        let start = new Date(
          moment(this.navParams.get("selectedDay")).format()
        );
        let end = new Date(moment(this.navParams.get("selectedDay")).format());
        end.setMinutes(end.getMinutes() + this.types[0].sure);
        this.event.startTime = start.toISOString();
        this.event.endTime = end.toISOString();
      } else if (result.returncode === "4") {
        this.isEmptyType = true;
        this.event.type = "-99";
        let start = new Date(
          moment(this.navParams.get("selectedDay")).format()
        );
        let end = new Date(moment(this.navParams.get("selectedDay")).format());
        end.setMinutes(end.getMinutes() + 30);
        this.event.startTime = start.toISOString();
        this.event.endTime = end.toISOString();
      } else {
        this.presentToast(result.message);
      }
    });

    }

  }

  adjustTime(duration) {
    let start = new Date(moment(this.event.startTime).format());
    let end = new Date(moment(this.event.startTime).format());

    end.setMinutes(end.getMinutes() + duration);

    this.event.endTime = end.toISOString();

    this.event.duration = duration;
  }

  adjustTimeByDate() {
    if (!this.isEmptyType) {
      let start = new Date(moment(this.event.startTime).format());
      let end = new Date(moment(this.event.startTime).format());

      end.setMinutes(end.getMinutes() + Number(this.event.duration));

      this.event.endTime = end.toISOString();
    }
  }
}
