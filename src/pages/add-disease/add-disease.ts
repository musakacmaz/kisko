import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events,
  ToastController,
  LoadingController
} from "ionic-angular";
import { RelationUserProvider } from "../../providers/user/relation-user";
import { OzgecmisProvider } from "../../providers/ozgecmis/ozgecmis";

@IonicPage()
@Component({
  selector: "page-add-disease",
  templateUrl: "add-disease.html"
})
export class AddDiseasePage {
  hastalikid: any;
  grupid: any;
  disease_name: any;
  hastatc: any;
  loading: any;
  relationtypes: any[] = [{ isselected: "" }];

  selected: any[] = [{}];

  durum: boolean = false;
  gecmiste: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public toastCtrl: ToastController,
    private relation: RelationUserProvider,
    private ozgecmis: OzgecmisProvider
  ) {
    this.disease_name = this.navParams.get("disease_name");
    this.grupid = this.navParams.get("grupid");
    this.hastalikid = this.navParams.get("hastalikid");
    this.hastatc = this.navParams.get("hastatc");

    this.getRelations();
  }

  ionViewDidLoad() {}

  getRelations() {
    var creds = "token=" + localStorage.getItem("token");

    this.relation.relationList(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.relationtypes.length; i++) {
          this.relationtypes[i] = result.relationtypes[i];
        }
      } else {
        this.presentToast(result.message);
      }
    });
  }

  addDisease() {
    var hastalik_durum;
    var hastalik_gecmiste;

    if (this.durum === false) {
      hastalik_durum = "2";
    } else {
      hastalik_durum = "1";
    }

    if (this.gecmiste === false) {
      hastalik_gecmiste = "0";
    } else {
      hastalik_gecmiste = "1";
    }

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&hastatc=" +
      this.hastatc +
      "&hastalikid=" +
      this.hastalikid +
      "&hastalikgrupid=" +
      this.grupid +
      "&durum=" +
      hastalik_durum +
      "&gecmiste=" +
      hastalik_durum +
      "&ailebagitipi=" +
      "[" + this.selected + "]";

    this.showLoader();

    this.ozgecmis.ozgecmis(creds).subscribe(result => {
      this.loading.dismiss();
      if (result.returncode === "0") {
        this.events.publish("ozgecmis", true);
        this.navCtrl.pop();
      } else {
        this.presentToast(result.message);
      }
    });



    /* var splitted = this.selected.toString().split(",");
    console.log("aile: " + splitted[0]);*/
  }

  onSelectChange(selectedValue: any) {
    console.log("Selected: ", selectedValue);
  }

  cancel() {
    this.viewCtrl.dismiss();
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

  showLoader() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
}
