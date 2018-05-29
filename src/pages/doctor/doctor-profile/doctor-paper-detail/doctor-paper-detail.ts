import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { MedyaProvider } from "../../../../providers/medya/medya";

let apiUrl = "http://kisko.net/apiv2/medya.php";

@IonicPage()
@Component({
  selector: "page-doctor-paper-detail",
  templateUrl: "doctor-paper-detail.html"
})
export class DoctorPaperDetailPage {
  loading: any;

  paper: any = {
    url: "",
    title: "",
    description: ""
  };

  fileData: any;
  fileType: any;
  fileName: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private file: File,
    private medya: MedyaProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events
  ) {}

  ionViewDidLoad() {}

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

  public onFileFromStorageChosen(filesEvent: any) {
    this.processFileFromStorage(filesEvent);
  }

  public processFileFromStorage(event: any) {
    let file = event.target.files[0];
    //you can read various properties of the file (like mimetype and size) from the file object.
    console.log(file);
    this.fileType = file.type;
    this.fileName = file.name;
    this.readfile(file);
 }

//this one reads the contents of the file as a URL that contains its data:

  public readfile(file: any): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      let dataUrl = reader.result;
      //and do something with the reader.
      this.fileData = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  save() {

    this.showLoader();
    var options: FileUploadOptions = {
      fileKey: "medya",
      fileName: this.fileName,
      chunkedMode: false,
      mimeType: this.fileType,
      params: {
        token: localStorage.getItem("token"),
        action: "1",
        aciklama: this.paper.description,
        baslik: this.paper.title,
        gonderentc: localStorage.getItem("tckimlik"),
        medyatipiid: "1"
      }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(this.fileData, apiUrl, options, true).then(
      result => {
        this.events.publish("paper:added");
        this.loading.dismiss();
        this.navCtrl.pop();
      },
      err => {
        this.loading.dismiss();
        alert("error" + JSON.stringify(err));
      }
    );
  }

}
