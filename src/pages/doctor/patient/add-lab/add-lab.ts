import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform,
  LoadingController,
  ToastController,
  Events,
  ViewController
} from "ionic-angular";
import { LabistekProvider } from "../../../../providers/labistek/labistek";
import { KurumProvider } from "../../../../providers/kurum/kurum";

@IonicPage()
@Component({
  selector: "page-add-lab",
  templateUrl: "add-lab.html"
})
export class AddLabPage {
  loading: any;
  isSelection: boolean = false;
  selectedTetkik: any;
  tetkikler: any[] = [{ ischecked: false, kurumid: "", kurumadi: "" }];
  kurumlar: any[] = [{ ischecked: false }];
  istem: any;
  muayeneid: any;
  hastatc: any;

  labrequest: any = { kurumid: "", istem: "" };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private labistek: LabistekProvider,
    private kurum: KurumProvider,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.muayeneid = this.navParams.get("muayeneid");
    this.hastatc = this.navParams.get("hastatc");
    this.getKurum();
  }

  ionViewDidLoad() {}

  requestLab() {
    this.showLoader();

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&kurumid=" +
      this.labrequest.kurumid +
      "&muayeneid=" +
      this.muayeneid +
      "&istektipi=" +
      "1" +
      "&istem=" +
      this.labrequest.istem +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&hastatc=" +
      this.hastatc;

    this.labistek.labistek(creds).subscribe(result => {
      this.loading.dismiss();
      if (result.returncode === "0") {
        this.events.publish("lab:added", true);
      } else {
        this.presentToast(result.message);
      }
    });

    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  getKurum() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&kurumtipi=" +
      "6";

    this.kurum.kurum(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.kurum.length; i++) {
          this.kurumlar[i] = result.kurum[i];
        }
        this.labrequest.kurumid = this.kurumlar[0].kurumid;
      } else {
        this.presentToast(result.returncode);
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

    toast.onDidDismiss(() => {});

    toast.present();
  }

}
