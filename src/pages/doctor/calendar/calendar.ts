import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ActionSheetController,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { LoginService } from "../../../providers/user/islogin";
import { registerLocaleData } from "@angular/common";
import trLocale from "@angular/common/locales/tr";
registerLocaleData(trLocale);
import * as moment from "moment";
import { RandevuProvider } from "../../../providers/randevu/randevu";

@IonicPage()
@Component({
  selector: "page-calendar",
  templateUrl: "calendar.html"
})
export class CalendarPage {
  loading: any;

  eventSource;
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: "month",
    currentDate: this.selectedDay,
    locale: "tr-TR"
  };

  isLoaded: boolean = false;

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public islogin: LoginService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private randevu: RandevuProvider,
    public events: Events
  ) {
    this.loadEvents();

    this.doctortc = this.navParams.get("doctortc");

    this.events.subscribe("event", result => {
      if (result === true) {
        this.isLoaded = false;
        this.loadEvents();
      }
    });
  }

  loadEvents() {
    setTimeout(() => {
      this.eventSource = this.getEvents();
    });
  }

  addEvent() {
    let modal = this.modalCtrl.create("AddEventPage", {
      selectedDay: this.selectedDay,
      doctortc: this.doctortc
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.isLoaded = false;
        this.loadEvents();
        this.calendar.currentDate = new Date(data.startTime);
      }
    });
  }

  getEvents() {
    var events = [];

    this.showLoader();

    if(localStorage.getItem("role") === "secretary"){

      var creds2 =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.randevu.randevu(creds2).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.randevu.length; i++) {
          let start = new Date(
            moment(result.randevu[i].baslangictarih).format()
          );
          let end = new Date(moment(result.randevu[i].bitistarih).format());

          events.push({
            title: result.randevu[i].aciklama,
            startTime: start,
            endTime: end,
            color: "#" + result.randevu[i].hexcode,
            id: result.randevu[i].randevuid,
            type: result.randevu[i].randevutipiadi
          });
        }
        this.isLoaded = true;
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

    this.randevu.randevu(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        for (var i = 0; i < result.randevu.length; i++) {
          let start = new Date(
            moment(result.randevu[i].baslangictarih).format()
          );
          let end = new Date(moment(result.randevu[i].bitistarih).format());

          events.push({
            title: result.randevu[i].aciklama,
            startTime: start,
            endTime: end,
            color: "#" + result.randevu[i].hexcode,
            id: result.randevu[i].randevuid,
            type: result.randevu[i].randevutipiadi
          });
        }
        this.isLoaded = true;
      } else {
        this.presentToast(result.message);
      }
    });

    }


    return events;
  }

  /* Takvim Modunu Değiştirir */
  changeMode(mode) {
    this.calendar.mode = mode;
  }
  /* Takvim Başlığını Değiştirir */
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Tarih Seçildiğinde
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  // Etkinlik Seçildiğinde
  onEventSelected(event) {

    console.log(event);

      var date = moment(event.startTime);
      date.locale("tr");
      let start = moment(date).format("LLL");

      date = moment(event.endTime);
      date.locale("tr");
      let end = moment(date).format("LLL");

      let alert = this.alertCtrl.create({
        title: event.type,
        subTitle: "" + event.title,
        message: "Başlangıç: " + start + "<br>Bitiş: " + end,
        buttons: [
          {
            text: "Düzenle",

            handler: () => {

              let modal = this.modalCtrl.create("UpdateEventPage", {
                eventid: event.id,
                doctortc: this.doctortc
              });
              modal.present();
            }
          },
          {
            text: "Kapat",
            role: "cancel",
            handler: () => {}
          }
        ]
      });

      alert.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Günlük",
          handler: () => {
            this.changeMode("day");
          }
        },
        {
          text: "Haftalık",
          handler: () => {
            this.changeMode("week");
          }
        },
        {
          text: "Aylık",
          handler: () => {
            this.changeMode("month");
          }
        },
        {
          text: "Bugün",
          handler: () => {
            this.calendar.currentDate = new Date();
          }
        },
        {
          text: "Vazgeç",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
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
