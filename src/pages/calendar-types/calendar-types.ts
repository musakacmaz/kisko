import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  ModalController,
  Events,
  AlertController
} from "ionic-angular";
import { RandevuTipiProvider } from "../../providers/randevu-tipi/randevu-tipi";

@IonicPage()
@Component({
  selector: "page-calendar-types",
  templateUrl: "calendar-types.html"
})
export class CalendarTypesPage {
  loading: any;
  types: any[] = [{}];
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public events: Events,
    public alertCtrl: AlertController,
    private randevutipi: RandevuTipiProvider
  ) {
    this.getTypes();

    this.events.subscribe("randevutipi", result => {
      if (result === true) {
        this.types = [{}];
        this.isEmpty = false;
        this.getTypes();
      }
    });
  }

  ionViewDidLoad() {}

  getTypes() {
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
      } else if (result.returncode === "4") {
        this.isEmpty = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  addType() {
    let modal = this.modalCtrl.create("AddCalendarTypesPage");
    modal.present();
  }

  deleteType(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&randevutipiid=" +
      id +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.randevutipi.randevutipi(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.types = [{}];
        this.getTypes();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  updateType(type){

    let modal = this.modalCtrl.create("UpdateCalendarTypePage", {type: type});
    modal.present();

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

  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: "Randevu türünü silmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.deleteType(id);
          }
        }
      ]
    });
    confirm.present();
  }
}
