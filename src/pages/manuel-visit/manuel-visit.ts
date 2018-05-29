import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController,
  Events
} from "ionic-angular";
import { ManuelVisitProvider } from "../../providers/manuel-visit/manuel-visit";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-manuel-visit",
  templateUrl: "manuel-visit.html"
})
export class ManuelVisitPage {
  id: any;
  loading: any;
  manuelvisit: any[] = [{formatted: ''}];
  userinfo: any[] = [
    {
      hastaadi: "",
      hastasoyadi: "",
      hastacinsiyet: "",
      hastayas: "",
      hastameslek: "",
      hastasigara: ""
    }
  ];
  userkey: any;

  hastainfo: any[] = [{}];

  isDoctor: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private manuel: ManuelVisitProvider,
    public alertCtrl: AlertController,
    public events: Events
  ) {
    this.id = this.navParams.get("id");

    if (this.navParams.get("isDoctor") === true) {
      this.isDoctor = true;
    } else if (this.navParams.get("isDoctor") === false) {
      this.isDoctor = false;
    }
    this.getManuelVisit();
    if (this.isDoctor) {
      this.hastainfo[0] = this.navParams.get("hastainfo");
      this.userkey =
        this.hastainfo[0].hastaadi +
        " " +
        this.hastainfo[0].hastasoyadi +
        " • " +
        this.hastainfo[0].hastayas +
        " • " +
        this.hastainfo[0].hastameslek;
    }
  }

  ionViewDidLoad() {}

  getManuelVisit() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&manuelvizitid=" +
      this.id;

    this.showLoader();

    this.manuel.manuel(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.loading.dismiss();

        this.manuelvisit[0] = result.manuelvizit[0];

        var date = moment(this.manuelvisit[0].tarih);
        date.locale("tr");
        this.manuelvisit[0].formatted = moment(date).format("LL");
      } else {
        this.loading.dismiss();
        this.presentToast(result.message);
      }
    });
  }

  deleteManuelVisit() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&manuelvizitid=" +
      this.manuelvisit[0].manuelvizitid;

    this.showLoader();

    this.manuel.manuel(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.events.publish("manuel", true);
          this.presentToast(result.message);
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
  }

  goUpdateVisit() {
    this.navCtrl.push("UpdateManuelVisitPage", {
      updateInfo: this.manuelvisit[0]
    });
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

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Ziyareti silmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.deleteManuelVisit();
          }
        }
      ]
    });
    confirm.present();
  }

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      subTitle: "Yeniden giriş yapmak ister misiniz?",
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
