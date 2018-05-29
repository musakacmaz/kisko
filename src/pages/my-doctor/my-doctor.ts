import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Events
} from "ionic-angular";
import { DoktorSekreterProvider } from "../../providers/doktor-sekreter/doktor-sekreter";
import { GetUserProvider } from '../../providers/user/get-user';

@IonicPage()
@Component({
  selector: "page-my-doctor",
  templateUrl: "my-doctor.html"
})
export class MyDoctorPage {

  doctors: any = [{}];
  activedoctortc: any;

  selectOptions: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private doktorsekreter: DoktorSekreterProvider,
    public toastCtrl: ToastController,
    private getUser: GetUserProvider,
    public events: Events
  ) {
    this.getDoctors();
  }

  ionViewDidLoad() {}

  getDoctors() {

    var creds2 = "token=" + localStorage.getItem("token") + "&tckimlik=" + localStorage.getItem("tckimlik");

    this.getUser.getUser(creds2).subscribe(result => {

      if(result.returncode === "0"){
        this.activedoctortc = result.userinfo[0].lastdoctor[0].doktortc;

      }
      else{
        this.presentToast(result.message);
      }

    })

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&sekretertc=" +
      localStorage.getItem("tckimlik");



    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.doktorsekreter.length; i++) {
          this.doctors[i] = result.doktorsekreter[i];
        }
      } else {
        this.presentToast(result.message);
      }
    });
  }

  changeLastDoctor(doktortc){

    var creds = "token=" + localStorage.getItem("token") + "&action=" + "5" + "&sekretertc=" + localStorage.getItem("tckimlik") + "&doktortc=" + doktortc;

    this.doktorsekreter.doktorsekreter(creds).subscribe(result => {

      if(result.returncode === "0"){

        this.events.publish("doctor:changed");
      }
      else{
        this.presentToast(result.message);
      }
    })
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
