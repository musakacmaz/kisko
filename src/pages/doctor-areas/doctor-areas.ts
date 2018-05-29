import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  ModalController,
  Events,
  AlertController
} from "ionic-angular";
import { DoktorSahaProvider } from "../../providers/doktor-saha/doktor-saha";
import { DoktorSahaVeriProvider } from "../../providers/doktor-saha-veri/doktor-saha-veri";

@IonicPage()
@Component({
  selector: "page-doctor-areas",
  templateUrl: "doctor-areas.html"
})
export class DoctorAreasPage {

  loading: any;
  areas: any[] = [{}];
  isEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public events: Events,
    public alertCtrl: AlertController,
    private doktorsaha: DoktorSahaProvider
  ) {
    this.getAreas();

    this.events.subscribe("doctorarea", result => {
      if (result === true) {
        this.areas = [{}];
        this.isEmpty = false;
        this.getAreas();
      }
    });
  }

  ionViewDidLoad() {}

  getAreas() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.showLoader();

    this.doktorsaha.doktorsaha(creds).subscribe(
      result => {
        this.loading.dismiss();

        if(result.returncode === "0"){

          for(var i = 0; i < result.doktorsaha.length; i++){

            this.areas[i] = result.doktorsaha[i];
          }

        }
        else if(result.returncode === "4"){

          this.isEmpty = true;

        }
        else{
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  addArea(){
    let modal = this.modalCtrl.create("AddDoctorAreasPage");
    modal.present();
  }

  updateData(value, id, order) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&doktorsahaid=" +
      id +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sahaadi=" +
      value +
      "&sirano=" +
      order;

    this.doktorsaha.doktorsaha(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.getAreas();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        alert(err);
      }
    );
  }

  deleteData(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&doktorsahaid=" +
      id;

    this.doktorsaha.doktorsaha(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.areas = [{}];
          this.getAreas();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        alert(err);
      }
    );
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

  showPrompt(id, value, order) {
    let prompt = this.alertCtrl.create({
      title: "Saha Güncelleme",
      message: "Lütfen saha bilgilerini giriniz.",
      inputs: [
        {
          name: "title",
          type: "",
          label: "Saha Adı",
          placeholder: value,
          value: ""
        },
        {
          name: "order",
          type: "number",
          label: "Sıra No",
          placeholder: order,
          value: ""
        }
      ],
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Kaydet",
          handler: () => {
            this.updateData(prompt.data.inputs[0].value, id, prompt.data.inputs[1].value);
          }
        }
      ]
    });
    prompt.present();
  }

  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: "Sahayı silmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, Eminim",
          handler: () => {
            this.deleteData(id);
          }
        }
      ]
    });
    confirm.present();
  }
}
