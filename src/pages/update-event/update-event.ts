import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ViewController,
  Events,
  AlertController
} from "ionic-angular";
import { RandevuTipiProvider } from "../../providers/randevu-tipi/randevu-tipi";
import { RandevuProvider } from "../../providers/randevu/randevu";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-update-event",
  templateUrl: "update-event.html"
})
export class UpdateEventPage {
  isEmptyType: boolean = false;
  types: any = [{}];

  eventid: any;

  event = {
    startTime: "",
    endTime: "",
    description: "",
    type: "0",
    duration: ""
  };

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private randevutipi: RandevuTipiProvider,
    private randevu: RandevuProvider,
    public viewCtrl: ViewController,
    public events: Events,
    public alertCtrl: AlertController
  ) {
    this.eventid = this.navParams.get("eventid");
    this.doctortc = this.navParams.get("doctortc");
    this.getTypes(this.eventid);
  }

  ionViewDidLoad() {}

  getEvent(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&randevuid=" +
      this.eventid;

    this.randevu.randevu(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.event.startTime = moment(
          result.randevu[0].baslangictarih
        ).format();
        this.event.endTime = moment(result.randevu[0].bitistarih).format();
        this.event.description = result.randevu[0].aciklama;
        this.event.duration = result.randevu[0].sure;
        this.event.type = result.randevu[0].randevutipi;
      } else {
        this.presentToast(result.message);
      }
    });
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

    if(localStorage.getItem("role") === "secretary"){

      var creds2 =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&doktortc=" +
      this.doctortc +
      "&baslangictarih=" +
      moment(this.event.startTime).format("YYYY-MM-DD HH:mm") +
      "&bitistarih=" +
      moment(this.event.endTime).format("YYYY-MM-DD HH:mm") +
      "&aciklama=" +
      this.event.description +
      "&randevutipi=" +
      randevutipi +
      "&kayityapantc=" +
      localStorage.getItem("tckimlik") +
      "&randevuid=" +
      this.eventid;

    this.randevu.randevu(creds2).subscribe(result => {
      if (result.returncode === "0") {
        this.viewCtrl.dismiss();
        this.events.publish("event", true);
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
      "2" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&baslangictarih=" +
      moment(this.event.startTime).format("YYYY-MM-DD HH:mm") +
      "&bitistarih=" +
      moment(this.event.endTime).format("YYYY-MM-DD HH:mm") +
      "&aciklama=" +
      this.event.description +
      "&randevutipi=" +
      randevutipi +
      "&kayityapantc=" +
      localStorage.getItem("tckimlik") +
      "&randevuid=" +
      this.eventid;

    this.randevu.randevu(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.viewCtrl.dismiss();
        this.events.publish("event", true);
      } else {
        this.presentToast(result.message);
      }
    });

    }
  }

  }

  deleteEvent() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&randevuid=" +
      this.eventid;

    this.randevu.randevu(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.viewCtrl.dismiss();
        this.events.publish("event", true);
      } else {
        this.presentToast(result.message);
      }
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  getTypes(id) {

    if(localStorage.getItem("role") === "secretary"){

      var creds2 =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.randevutipi.randevutipi(creds2).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.randevutipi.length; i++) {
          this.types[i] = result.randevutipi[i];
        }
      } else if (result.returncode === "4") {
        this.isEmptyType = true;
      } else {
        this.presentToast(result.message);
      }
    });

    this.getEvent(id);

    }
    else{

      var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.randevutipi.randevutipi(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.randevutipi.length; i++) {
          this.types[i] = result.randevutipi[i];
        }
      } else if (result.returncode === "4") {
        this.isEmptyType = true;
      } else {
        this.presentToast(result.message);
      }
    });

    this.getEvent(id);

    }

  }

  adjustTime(duration) {
    let start = new Date(moment(this.event.startTime).format());
    let end = new Date(moment(this.event.endTime).format());

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

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Etkinliği silmek istediğinize emin misiniz?',
      buttons: [
        {
          text: 'Vazgeç',
          handler: () => {
          }
        },
        {
          text: 'Evet, eminim',
          handler: () => {
            this.deleteEvent();
          }
        }
      ]
    });
    confirm.present();
  }
}
