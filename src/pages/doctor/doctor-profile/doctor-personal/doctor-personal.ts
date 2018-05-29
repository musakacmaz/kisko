import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  ActionSheetController,
  ModalController,
  Events,
  AlertController
} from "ionic-angular";
import { DoktorProvider } from "../../../../providers/doktor/doktor";
import { Camera } from "@ionic-native/camera";
import { LoginService } from "../../../../providers/user/islogin";

@IonicPage()
@Component({
  selector: "page-doctor-personal",
  templateUrl: "doctor-personal.html"
})
export class DoctorPersonalPage {
  doctorinfo: any[] = [{}];
  loading: any;

  doctortc: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private doktor: DoktorProvider,
    public actionCtrl: ActionSheetController,
    public camera: Camera,
    public modalCtrl: ModalController,
    public events: Events,
    public alertCtrl: AlertController,
    private islogin: LoginService
  ) {

    if(localStorage.getItem("role") === "secretary"){

      this.doctortc = this.navParams.get("doctortc");
      this.getDoctor();

    }
    else{

      this.doctortc = localStorage.getItem("tckimlik");
      this.getDoctor();

    }



    this.events.subscribe("profile:updated", result => {
      if (result === true) {
        this.getDoctor();
      }
    });
  }

  ionViewDidLoad() {}

  getDoctor() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&doktortc=" +
      this.doctortc;

    this.showLoader();

    this.doktor.doktor(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          this.doctorinfo[0] = result.doktor[0];
          this.islogin.avatar = this.doctorinfo[0].fotourl;
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.toastCtrl.create(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  presentActionSheet() {
    let action = this.actionCtrl.create({
      title: "Fotoğraf Kaynağı",
      buttons: [
        {
          text: "Galeriden Yükle",
          icon: "photos",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Kamerayı Kullan",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Vazgeç",
          role: "cancel",
          icon: "close"
        }
      ]
    });

    action.present();
  }

  takePicture(sourceType) {
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      targetHeight: 400
    };

    this.camera.getPicture(options).then(
      imagePath => {
        let modal = this.modalCtrl.create("UploadModalPage", {
          data: imagePath,
          tckimlik: this.doctortc
        });
        modal.present();
        modal.onDidDismiss(data => {
          if (data && data.reload) {
            this.getDoctor();
          }
        });
      },
      err => {
        console.log("Error: ", err);
      }
    );
  }

  openImage(img) {
    let modal = this.modalCtrl.create("PreviewModalPage", { img: img });

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

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      message: "Yeniden giriş yapmak ister misiniz?",
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
