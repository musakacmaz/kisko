import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform
} from "ionic-angular";
import { LabsonucProvider } from "../../../../providers/labsonuc/labsonuc";
import { LabistekProvider } from "../../../../providers/labistek/labistek";
import { LoadingController } from "ionic-angular/components/loading/loading-controller";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { KurumProvider } from "../../../../providers/kurum/kurum";
import { LoginService } from "../../../../providers/user/islogin";

@IonicPage()
@Component({
  selector: "page-lab-result",
  templateUrl: "lab-result.html"
})
export class LabResultPage {
  loading: any;
  labsonucid: any;
  labresult: any[] = [{ kurum: "", tetkik: '' }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: ActionSheetController,
    public platform: Platform,
    private labsonuc: LabsonucProvider,
    private labistek: LabistekProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private kurum: KurumProvider,
    public islogin: LoginService
  ) {
    this.labsonucid = this.navParams.get("labsonucid");

    this.getLabResult();
  }

  ionViewDidLoad() {}

  getLabResult() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&labsonucid=" +
      this.labsonucid;

    this.showLoader();

    this.labsonuc.labsonuc(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        this.labresult[0] = result.labsonuc[0];
        this.getKurum(this.labresult[0].kurumid);
      } else {
        this.presentToast(result.message);
      }
    });
  }

  getKurum(kurumid) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&kurumid=" +
      kurumid;

    this.kurum.kurum(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.labresult[0].kurum = result.kurum[0].kurumadi;
      } else {
        this.presentToast(result.message);
      }
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
}
