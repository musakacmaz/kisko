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

let apiUrl = "http://kisko.net/apiv2/belge.php";

@IonicPage()
@Component({
  selector: "page-upload-document",
  templateUrl: "upload-document.html"
})
export class UploadDocumentPage {
  imageData: any;
  loading: any;
  id: any;
  type: any;

  documentinfo = {baslik: "", aciklama: ""}

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
    this.id = this.navParams.get("id");
    this.type = this.navParams.get("type");
  }

  ionViewDidLoad() {}

  saveDocument(){
    this.showLoader();

    var options: FileUploadOptions = {
      fileKey: "belge",
      fileName: this.imageData + ".jpg",
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {
        token: localStorage.getItem("token"),
        action: "1",
        islemtipi: "2",
        islemid: this.id,
        belgetipi: "1",
        baslik: this.documentinfo.baslik,
        aciklama: this.documentinfo.aciklama
      }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(this.imageData, apiUrl, options, true).then(
      result => {
        this.events.publish("document:added", true);
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
}
