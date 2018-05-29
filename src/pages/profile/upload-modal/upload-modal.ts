import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";

let apiUrl = "http://kisko.net/apiv2/user_photoupload.php";

@IonicPage()
@Component({
  selector: "page-upload-modal",
  templateUrl: "upload-modal.html"
})
export class UploadModalPage {
  imageData: any;
  loading: any;
  id: any;
  tckimlik: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    public events: Events
  ) {
    this.imageData = this.navParams.get("data");
    this.tckimlik = this.navParams.get("tckimlik");
  }

  saveImage() {
    this.showLoader();
    var options: FileUploadOptions = {
      fileKey: "photo",
      fileName: this.imageData + ".jpg",
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {
        token: localStorage.getItem("token"),
        tckimlik: this.tckimlik
      }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(this.imageData, apiUrl, options, true).then(
      result => {
        this.events.publish("profile:updated", true);
        this.loading.dismiss();
        this.dismiss();
      },
      err => {
        this.loading.dismiss();
        alert("error" + JSON.stringify(err));
      }
    );
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({});

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
