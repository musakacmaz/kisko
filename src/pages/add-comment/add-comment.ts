import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  AlertController,
  Events
} from "ionic-angular";
import { VisitYorumProvider } from "../../providers/visit-yorum/visit-yorum";
import { ViewChild } from "@angular/core/src/metadata/di";

@IonicPage()
@Component({
  selector: "page-add-comment",
  templateUrl: "add-comment.html"
})
export class AddCommentPage {
  id: any;

  commentinfo = {
    puan: "",
    yorumtext: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    private visityorum: VisitYorumProvider
  ) {
    this.id = this.navParams.get("id");
  }

  ionViewDidLoad() {}

  close(){
    this.viewCtrl.dismiss();
  }

  saveComment() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "1" +
      "&hastatc=" +
      localStorage.getItem("tckimlik") +
      "&muayeneid=" +
      this.id +
      "&puan=" +
      this.commentinfo.puan +
      "&yorumtext=" +
      this.commentinfo.yorumtext;

    this.visityorum.visityorum(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.showAlert();
        this.events.publish("comment", true);
        this.navCtrl.pop();
      } else {
        this.presentToast(result.message);
      }
    });
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

  showAlert() {
    let alert = this.alertCtrl.create({
      title: "Tebrikler!",
      subTitle: "Yorumunuz başarıyla kaydedildi.",
      buttons: ["Tamam"]
    });
    alert.present();
  }
}
