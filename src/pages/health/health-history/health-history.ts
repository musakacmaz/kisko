import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  AlertController,
  Events,
  ModalController,
  ViewController
} from "ionic-angular";
import { LoginService } from "../../../providers/user/islogin";
import { HastalikGrupProvider } from "../../../providers/hastalik-grup/hastalik-grup";
import { HastalikProvider } from "../../../providers/hastalik/hastalik";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { GecmisProvider } from "../../../providers/gecmis/gecmis";

@IonicPage()
@Component({
  selector: "page-health-history",
  templateUrl: "health-history.html"
})
export class HealthHistoryPage {
  loading: any;
  information: any[] = [{ hastaliklar: [] }];
  hastatc: any;
  isDoctor: boolean;
  isUpdate: boolean = false;
  id: any;
  gecmisinfo = {
    ozgecmis: "",
    soygecmis: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public islogin: LoginService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private hastalikgrup: HastalikGrupProvider,
    private hastalik: HastalikProvider,
    private gecmis: GecmisProvider
  ) {
    /*
    let localData = http
      .get("assets/information.json")
      .map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    });*/

    this.getHastalikGrup();

    this.hastatc = this.navParams.get("hastatc");
    this.isDoctor = this.navParams.get("isDoctor");
    this.isUpdate = this.navParams.get("isUpdate");
    this.gecmisinfo.ozgecmis = this.navParams.get("ozgecmis");
    this.gecmisinfo.soygecmis = this.navParams.get("soygecmis");
    this.id = this.navParams.get("id");

  }

  ionViewDidLoad() {}

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }

  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j]
      .open;
  }

  save() {
    this.navCtrl.pop();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  goAddDisease(hastalikid, grupid, name) {
    let modal = this.modalCtrl.create("AddDiseasePage", {
      hastalikid: hastalikid,
      grupid: grupid,
      disease_name: name,
      hastatc: this.hastatc
    });

    modal.present();
  }

  getHastalikGrup() {
    var creds = "token=" + localStorage.getItem("token") + "&action=" + "4";

    this.showLoader();

    this.hastalikgrup.hastalikgrup(creds).subscribe(result => {
      this.loading.dismiss();
      if (result.returncode === "0") {
        for (var i = 0; i < result.hastalikgrup.length; i++) {
          this.information[i] = result.hastalikgrup[i];
          this.getHastalikById(this.information[i].hastalikgrupid, i);
        }
      } else {
        this.presentToast(result.message);
      }
    });
  }

  getHastalikById(id, index) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&hastalikgrupid=" +
      id;

    this.hastalik.hastalik(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.information[index].hastaliklar = result.hastalik;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  addGecmis() {
    var creds;
    if(!this.isUpdate){
      creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&hastatc=" +
      this.hastatc +
      "&ekleyentc=" +
      localStorage.getItem("tckimlik") +
      "&ozgecmis=" +
      this.gecmisinfo.ozgecmis +
      "&soygecmis=" +
      this.gecmisinfo.soygecmis;

    this.gecmis.gecmis(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.events.publish("ozgecmis", true);
        this.navCtrl.pop();
      } else {
        this.presentToast(result.message);
      }
    });

    }
    else {
      creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&hastatc=" +
      this.hastatc +
      "&ekleyentc=" +
      localStorage.getItem("tckimlik") +
      "&ozgecmis=" +
      this.gecmisinfo.ozgecmis +
      "&soygecmis=" +
      this.gecmisinfo.soygecmis +
      "&gecmisid=" +
      this.id;

    this.gecmis.gecmis(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.events.publish("ozgecmis", true);
        this.navCtrl.pop();
      } else {
        this.presentToast(result.message);
      }
    });

    }

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
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
}
