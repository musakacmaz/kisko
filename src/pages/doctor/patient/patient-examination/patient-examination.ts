import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  FabContainer,
  LoadingController,
  ToastController,
  AlertController,
  Events,
  ModalController
} from "ionic-angular";
import { MuayeneProvider } from "../../../../providers/muayene/muayene";
import { LabsonucProvider } from "../../../../providers/labsonuc/labsonuc";
import { LabistekProvider } from "../../../../providers/labistek/labistek";
import * as moment from "moment";
import {
  InAppBrowser,
  InAppBrowserOptions
} from "@ionic-native/in-app-browser";
import { BelgeProvider } from "../../../../providers/belge/belge";
import { Camera } from "@ionic-native/camera";
import { VisitYorumProvider } from "../../../../providers/visit-yorum/visit-yorum";
import { DoktorSahaVeriProvider } from "../../../../providers/doktor-saha-veri/doktor-saha-veri";
import { DoktorSahaProvider } from "../../../../providers/doktor-saha/doktor-saha";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-patient-examination",
  templateUrl: "patient-examination.html"
})
export class PatientExaminationPage {
  showMenuItem: boolean = false;
  loading: any;
  type: any;
  id: any;
  examination: any[] = [{ formatted: "" }];
  isDoctor: boolean = false;
  isOwnDoctor: boolean = false;
  hastatc: any;

  visitid: any;
  token: any;

  userinfo: any[] = [
    {
      hastaadi: "",
      hastasoyadi: "",
      hastacinsiyet: "",
      hastayas: "",
      hastameslek: "",
      hastasigara: ""
    }
  ];

  hastainfo: any[0] = [{}];

  userkey: any;

  labresults: any[] = [
    {
      tetkikadi: "",
      istektarih: ""
    }
  ];

  labrequests: any[] = [{}];
  tetkiks: any[] = [{}];
  documents: any[] = [{}];
  comment: any[] = [{}];

  areas: any[] = [{ deger1: "", doktorsahaveriid: "" }];
  isEmptyComment: boolean;
  isEmptyLab: boolean = false;
  isEmptyArea: boolean = false;

  examinations: any[] = [{}];
  index: any;

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private muayene: MuayeneProvider,
    private labistek: LabistekProvider,
    private labsonuc: LabsonucProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    public modalCtrl: ModalController,
    private iab: InAppBrowser,
    private belge: BelgeProvider,
    private camera: Camera,
    private visityorum: VisitYorumProvider,
    private doktorsahaveri: DoktorSahaVeriProvider,
    private doktorsaha: DoktorSahaProvider,
    public formBuilder: FormBuilder
  ) {
    this.type = this.navParams.get("type");
    this.id = this.navParams.get("id");
    this.isDoctor = this.navParams.get("isDoctor");
    this.isOwnDoctor = this.navParams.get("isOwnDoctor");
    this.hastatc = this.navParams.get("hastatc");
    this.token = localStorage.getItem("token");
    this.visitid = localStorage.getItem("visitid");
    this.examinations = this.navParams.get("examinations");

    if (this.isDoctor) {
      this.hastainfo[0] = this.navParams.get("hastainfo");

      if (
        this.hastainfo[0].hastacinsiyet === "erkek" ||
        this.hastainfo[0].hastacinsiyet === "Erkek"
      ) {
        this.userkey =
          this.hastainfo[0].hastaadi +
          " " +
          this.hastainfo[0].hastasoyadi +
          " • " +
          this.hastainfo[0].hastayas +
          " • " +
          this.hastainfo[0].hastameslek +
          " • " +
          " ♂️ ";
      } else if (
        this.hastainfo[0].hastacinsiyet === "kadın" ||
        this.hastainfo[0].hastacinsiyet === "Kadın"
      ) {
        this.userkey =
          this.hastainfo[0].hastaadi +
          " " +
          this.hastainfo[0].hastasoyadi +
          " • " +
          this.hastainfo[0].hastayas +
          " • " +
          this.hastainfo[0].hastameslek +
          " • " +
          " ♂️ ";
      }

      for (var i = 0; i < this.examinations.length; i++) {
        if (this.examinations[i].id === this.id) {
          this.index = i;
        }
      }
    }

    //this.getDetails(localStorage.getItem("token"));

    this.getExamination(localStorage.getItem("token"));
    this.getAreasById();
    this.getLabRequests(localStorage.getItem("token"));
    this.getDocuments(localStorage.getItem("token"));

    this.events.subscribe("lab:added", result => {
      if (result === true) {
        this.getLabRequests(localStorage.getItem("token"));
      }
    });

    this.events.subscribe("lab:deleted", result => {
      if (result === true) {
        this.labrequests = [{}];
        this.getLabRequests(localStorage.getItem("token"));
      }
    });

    this.events.subscribe("document:added", result => {
      if (result === true) {
        this.getDocuments(localStorage.getItem("token"));
      }
    });

    this.events.subscribe("document:deleted", result => {
      if (result === true) {
        this.documents = [{}];
        this.getDocuments(localStorage.getItem("token"));
      }
    });

    this.events.subscribe("comment", result => {
      if (result === true) {
        this.getExamination(localStorage.getItem("token"));
      }
    });

    this.events.subscribe("examination", result => {
      if (result === true) {
        this.getAreasById();
      }
    });
  }

  ionViewDidLoad() {}

  getDetails(token) {
    this.getExamination(token);
    this.getAreasById();
    this.getLabRequests(token);
    this.getDocuments(token);
  }

  getExamination(token) {
    var creds = "token=" + token + "&action=" + "4" + "&muayeneid=" + this.id;
    this.showLoader();

    this.muayene.muayene(creds).subscribe(result => {
      this.loading.dismiss();

      if (result.returncode === "0") {
        this.examination[0] = result.muayene[0];
        var date = new Date(this.examination[0].tarih).toISOString();
        this.examination[0].tarih = date;
        date = new Date(this.examination[0].kontroltarihi).toISOString();
        this.examination[0].kontroltarihi = date;

        var date2 = moment(this.examination[0].tarih);
        date2.locale("tr");
        this.examination[0].formatted = moment(date2).format("L");

        date2 = moment(this.examination[0].kontroltarihi);
        date2.locale("tr");
        this.examination[0].formattedkontrol = moment(date2).format("L");

        this.getComment(token);
      } else if (result.returncode === "1") {
        this.doPrompt();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  getComment(token) {
    var creds = "token=" + token + "&action=" + "4" + "&muayeneid=" + this.id;

    this.visityorum.visityorum(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.comment[0] = result.vizityorum[0];
        this.isEmptyComment = false;
      } else if (result.returncode === "1") {
        this.doPrompt();
      } else if (result.returncode === "4") {
        this.isEmptyComment = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  openDocument(url: string) {
    const options: InAppBrowserOptions = {
      zoom: "yes"
    };

    const browser = this.iab.create(url, "_system", options);
  }

  getLabRequests(token) {
    var creds = "token=" + token + "&action=" + "4" + "&muayeneid=" + this.id;

    this.labistek.labistek(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.labistek.length; i++) {
          this.labrequests[i] = result.labistek[i];
          this.isEmptyLab = false;

          var date = moment(this.labrequests[i].istektarih);
          date.locale("tr");
          this.labrequests[i].istektarih = moment(date).format("LL");
        }
      } else if (result.returncode === "1") {
        this.doPrompt();
      } else if (result.returncode === "4") {
        this.isEmptyLab = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  deleteLabRequest(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&labistekid=" +
      id;
    this.labistek.labistek(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.events.publish("lab:deleted", true);
      } else {
        this.presentToast(result.message);
      }
    });
  }

  getDocuments(token) {
    var creds =
      "token=" +
      token +
      "&action=" +
      "4" +
      "&islemid=" +
      this.id +
      "&islemtipi=" +
      "2";

    this.belge.belge(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.belge.length; i++) {
          this.documents[i] = result.belge[i];

          var date = moment(this.documents[i].tarih);
          date.locale("tr");
          this.documents[i].tarih = moment(date).format("LL");
        }
      } else if (result.returncode === "1") {
        this.doPrompt();
      } else if (result.returncode === "4") {
      } else {
        this.presentToast(result.message);
      }
    });
  }

  addDocument() {}

  deleteDocument(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&belgeid=" +
      id;

    this.belge.belge(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.getDocuments(localStorage.getItem("token"));
      } else {
        this.presentToast(result.message);
      }
    });
  }

  itemTapped(page, fab: FabContainer, style) {
    if (page === 1 && fab && style === 1) {
      this.showMenuItem = !this.showMenuItem;
      fab.close();
      this.navCtrl.push("AddLabPage");
    } else if (page === 1 && fab && style === 2) {
      fab.close();
      this.navCtrl.push("AddLabPage");
    }
    if (page === 2) {
      this.navCtrl.push("LabResultPage");
    }
  }

  goAddLab() {
    let modal = this.modalCtrl.create("AddLabPage", {
      muayeneid: this.id,
      hastatc: this.hastatc
    });
    modal.present();
    //this.navCtrl.push("AddLabPage", { muayeneid: this.id, hastatc: this.hastatc });
  }

  goViewLab(labsonucid) {
    this.navCtrl.push("LabResultPage", { labsonucid: labsonucid });
  }

  goUpdateExamination() {
    this.navCtrl.push("UpdateExaminationPage", {
      examination: this.examination[0]
    });
  }

  showMenuItems() {
    this.showMenuItem = !this.showMenuItem;
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

  presentActionSheet() {
    let action = this.actionSheetCtrl.create({
      title: "Belge Kaynağını Seçin",
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
    var options;

    if (sourceType === 0) {
      options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
    } else if (sourceType === 1) {
      options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 1000,
        targetHeight: 1000
      };
    }

    this.camera.getPicture(options).then(
      imagePath => {
        let modal = this.modalCtrl.create("UploadDocumentPage", {
          data: imagePath,
          id: this.id,
          type: sourceType
        });
        modal.present();
        modal.onDidDismiss(data => {
          if (data && data.reload) {
            this.getDocuments(localStorage.getItem("token"));
          }
        });
      },
      err => {
        console.log("Error: ", err);
      }
    );
  }

  goAddComment() {
    let modal = this.modalCtrl.create("AddCommentPage", {
      id: this.examination[0].muayeneid
    });
    modal.present();
  }

  getAreasById() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&muayeneid=" +
      this.id;

    console.log(creds);

    this.doktorsahaveri.doktorsahaveri(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          for (var i = 0; i < result.muayenenotu.length; i++) {

            this.areas[i] =  result.muayenenotu[i];
          }
        } else if (result.returncode === "4") {
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }

  updateExamination() {
    if ((this.examination[0].kontroltarihi = "null")) {
      this.examination[0].kontroltarihi = "";
    }

    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&muayeneid=" +
      this.examination[0].muayeneid +
      "&tarih=" +
      this.examination[0].tarih +
      "&oyku=" +
      this.examination[0].oyku +
      "&bulgular=" +
      this.examination[0].bulgular +
      "&tani=" +
      this.examination[0].tani +
      "&aciklama=" +
      this.examination[0].aciklama +
      "&sonuc=" +
      this.examination[0].sonuc +
      "&muayenetipi=" +
      this.examination[0].muayenetipi +
      "&belgeid=" +
      this.examination[0].belgeid +
      "&yakinma=" +
      this.examination[0].yakinma +
      "&kontroltarihi=" +
      this.examination[0].kontroltarihi +
      "&kontrol=" +
      this.examination[0].kontrol;

    console.log(creds);

    this.showLoader();

    this.muayene.muayene(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.navCtrl.pop();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );

    this.updateAreas();
  }

  updateAreas() {
    for (var i = 0; i < this.areas.length; i++) {
      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "2" +
        "&muayeneid=" +
        this.examination[0].muayeneid +
        "&doktorsahaveriid=" +
        this.areas[i].doktorsahaveriid +
        "&deger1=" +
        this.areas[i].deger1 +
        "&doktortc=" +
        localStorage.getItem("tckimlik") +
        "&sahaid=" +
        this.areas[i].doktorsahaid;

      this.doktorsahaveri.doktorsahaveri(creds).subscribe(
        result => {
          if (result.returncode === "0") {
          }
        },
        err => {
          this.presentToast(err);
        }
      );
    }
    //this.events.publish("examination", true);
  }
}
