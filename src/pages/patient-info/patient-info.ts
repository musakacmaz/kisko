import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  LoadingController,
  ToastController,
  FabContainer,
  Events,
  ModalController
} from "ionic-angular";
import { VisitProvider } from "../../providers/visit/visit";
import * as moment from "moment";
import { DoktorHastaProvider } from "../../providers/doktor-hasta/doktor-hasta";
import { MuayeneProvider } from "../../providers/muayene/muayene";
import { SahaProvider } from "../../providers/saha/saha";
import { GetUserProvider } from "../../providers/user/get-user";
import { ManuelVisitProvider } from "../../providers/manuel-visit/manuel-visit";
import { GecmisProvider } from "../../providers/gecmis/gecmis";
import { Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: "page-patient-info",
  templateUrl: "patient-info.html"
})
export class PatientInfoPage {
  showMenuItem: boolean = false;
  isDoctor: boolean = false;
  patient;
  patient_name: any = null;
  hastatc: any;
  doktortc: any;
  type: any;
  loading: any;

  isOwnDoctor: boolean = false;

  auto_types;
  manual_types;

  details: any[] = [{}];
  areas: any[] = [{}];
  isEmptyArea: boolean = false;

  examinations: any[] = [{ id: "" }];

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

  hastainfo: any[] = [{}];

  hastaliklar: any[] = [{}];
  soygecmisler: any[] = [{}];

  isEmptyOzgecmis: boolean = false;

  isSecretary: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private visit: VisitProvider,
    private doktorhasta: DoktorHastaProvider,
    public events: Events,
    private muayene: MuayeneProvider,
    private getuser: GetUserProvider,
    private saha: SahaProvider,
    public modalCtrl: ModalController,
    private manuel: ManuelVisitProvider,
    private gecmis: GecmisProvider,
    public camera: Camera
  ) {
    this.type = navParams.get("type");

    if(localStorage.getItem("role") === "secretary"){
      this.isSecretary = true;
    }

    if (this.type === 1) {
      this.isDoctor = true;
      this.patient_name =
        navParams.get("patient_name") + " " + navParams.get("patient_surname");
      this.hastatc = navParams.get("hastatc");
      this.getAreas(this.hastatc);
      this.getPatient();
    } else if (this.type === 2) {
      this.hastatc = localStorage.getItem("tckimlik");
      this.patient_name = "Kayıtlarım";
      this.getAreas(localStorage.getItem("tckimlik"));
      this.getUser();
    }

    this.patient = "visit";
    this.doktortc = localStorage.getItem("tckimlik");

    if (!this.type) {
      this.patient_name = "Kayıtlarım";
    }
    this.initializeTypes();
    this.getVisit();
    this.getOzgecmis();

    if (this.isDoctor) {
      this.getUser();
    }

    this.events.subscribe("examination", result => {
      if (result === true) {
        this.getVisit();
      }
    });

    this.events.subscribe("manuel", result => {
      if (result === true) {
        this.getVisit();
      }
    });

    this.events.subscribe("ozgecmis", result => {
      if (result === true) {
        this.hastaliklar = [{}];
        this.getOzgecmis();
      }
    });

    this.events.subscribe("area", result => {
      if (result === true) {
        this.getAreas(localStorage.getItem("tckimlik"));
      } else {
        this.getAreas(result);
      }
    });
  }

  ionViewDidLoad() {}

  doRefresh(refresher) {
    this.getVisit();
    this.getOzgecmis();
    this.getAreas(this.hastatc);
    this.getUser();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  deleteExamination(id, doktortc) {
    if (doktortc !== localStorage.getItem("tckimlik")) {
      this.showAlert();
    } else {
      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "3" +
        "&muayeneid=" +
        id;

      this.showLoader();

      this.muayene.muayene(creds).subscribe(
        result => {
          if (result.returncode === "0") {
            this.loading.dismiss();
            this.getVisit();
          } else {
            this.loading.dismiss();
            this.presentToast(result.message);
          }
        },
        err => {
          this.loading.dismiss();
          this.presentToast(err);
        }
      );
    }
  }

  showConfirm(id, doktortc, type) {
    if (type === 1) {
      let confirm = this.alertCtrl.create({
        title: "Muayeneyi silmek istediğinize emin misiniz?",
        buttons: [
          {
            text: "Vazgeç",
            handler: () => {}
          },
          {
            text: "Evet, eminim",
            handler: () => {
              this.deleteExamination(id, doktortc);
            }
          }
        ]
      });
      confirm.present();
    } else if (type === 2) {
      let confirm = this.alertCtrl.create({
        title: "Kaydı silmek istediğinize emin misiniz?",
        buttons: [
          {
            text: "Vazgeç",
            handler: () => {}
          },
          {
            text: "Evet, eminim",
            handler: () => {
              this.deleteManuelVisit(id);
            }
          }
        ]
      });
      confirm.present();
    }
  }

  showHastalikConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: "Özgeçmiş bilgisini silmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, eminim",
          handler: () => {
            this.deleteOzgecmis(id);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteOzgecmis(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&gecmisid=" +
      id;

    this.gecmis.gecmis(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.hastaliklar = [{}];
        this.getOzgecmis();
      } else {
        this.presentToast(result.message);
      }
    });
  }

  getUser() {
    var creds =
      "token=" + localStorage.getItem("token") + "&tckimlik=" + this.hastatc;
    this.getuser.getUser(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.userinfo[0] = result.userinfo[0];
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }

  getPatient() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&hastatc=" +
      this.hastatc +
      "&doktortc=" +
      localStorage.getItem("tckimlik");
    this.doktorhasta.doktorhasta(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.hastainfo[0] = result.doktorhasta[0];
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.presentToast(err);
      }
    );
  }

  visitNavigation(type, id, doktortc, islemid) {

    if(localStorage.getItem("role") === "secretary"){
      this.presentToast("Yetki Yok");
    }
    else{

      if (type === "1") {
        this.navCtrl.push("ManuelVisitPage", {
          type: type,
          id: id,
          isDoctor: this.isDoctor,
          userinfo: this.userinfo[0],
          hastainfo: this.hastainfo[0]
        });
      } else if (
        type === "2" &&
        this.isDoctor &&
        doktortc === localStorage.getItem("tckimlik")
      ) {
        this.navCtrl.push("PatientExaminationPage", {
          type: type,
          id: id,
          isDoctor: true,
          isOwnDoctor: true,
          userinfo: this.userinfo[0],
          hastatc: this.hastatc,
          hastainfo: this.hastainfo[0],
          examinations: this.examinations
        });
      } else if (
        type === "2" &&
        this.isDoctor &&
        doktortc !== localStorage.getItem("tckimlik")
      ) {
        this.navCtrl.push("PatientExaminationPage", {
          type: type,
          id: id,
          isDoctor: true,
          isOwnDoctor: false,
          userinfo: this.userinfo[0],
          hastatc: this.hastatc,
          hastainfo: this.hastainfo[0],
          examinations: this.examinations
        });
      } else if (type === "2" && !this.isDoctor) {
        this.navCtrl.push("PatientExaminationPage", {
          type: type,
          id: id,
          visitid: islemid,
          examinations: this.examinations
        });
      } else if (type === "3") {
        this.navCtrl.push("CheckUpDetailsPage", {
          id: id
        });
      } else if (type === "4") {
        this.navCtrl.push("LabResultPage", {
          id: id
        });
      }
    }
  }

  itemTapped(page) {
    if (page === 1) {
      this.navCtrl.push("PatientExaminationPage", {
        type: page
      });
    } else if (page === 2) {
      this.navCtrl.push("PatientExaminationPage", {
        type: page
      });
    } else if (page === 3) {
      let modal = this.modalCtrl.create("HealthHistoryPage", {
        isDoctor: this.isDoctor,
        hastatc: this.hastatc
      });
      modal.present();
    } else if (page === 4) {
      this.navCtrl.push("AddManuelVisitPage");
    }
  }

  itemTappedData(type, pagetype) {
    this.navCtrl.push("PatientHealthDataDetailsPage", {
      data_name: type,
      page_type: pagetype
    });
  }

  goViewGecmis(ozgecmis, soygecmis, id) {
    let modal = this.modalCtrl.create("HealthHistoryPage", {
      isDoctor: this.isDoctor,
      hastatc: this.hastatc,
      ozgecmis: ozgecmis,
      soygecmis: soygecmis,
      isUpdate: true,
      id: id
    });
    modal.present();
  }

  initializeTypes() {
    this.auto_types = [
      "Adım",
      "Nabız",
      "Mesafe",
      "Kalori",
      "Aktivite",
      "Yağ Oranı",
      "Kan Şekeri"
    ];

    this.manual_types = ["Tansiyon", "Bel Çevresi", "Boy", "Kilo"];
  }

  addExamination() {
    this.navCtrl.push("AddExaminationPage", { hastatc: this.hastatc });
  }
  presentPrompt() {
    const alert = this.alertCtrl.create({
      title: "Yeni Veri Tipi Ekleyin",
      mode: "ios",
      inputs: [
        {
          name: "health_data",
          placeholder: "Veri Adı",
          type: "text"
        }
      ],
      buttons: [
        {
          text: "Vazgeç",
          role: "cancel",
          handler: data => {}
        },
        {
          text: "Tamam",
          handler: data => {}
        }
      ]
    });

    alert.present({ keyboardClose: false });
  }

  getVisit() {
    var creds;

    if (this.type === 1) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "4" +
        "&hastatc=" +
        this.hastatc;
    } else if (this.type === 2) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "4" +
        "&hastatc=" +
        localStorage.getItem("tckimlik");
    }

    this.showLoader();

    this.visit.visit(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          for (var i = 0; i < result.vizit.length; i++) {
            var index = 0;
            this.details[i] = result.vizit[i];

            if (this.details[i].islemtipi === "1") {
              var date = moment(this.details[i].tarih);
              date.locale("tr");
              this.details[i].tarih = moment(date).format("LL");
            } else if (this.details[i].islemtipi === "2") {
              var date2 = moment(this.details[i].tarih);
              date2.locale("tr");
              this.details[i].tarih = moment(date2).format("LL");
              this.examinations[index].id = this.details[i].muayeneid;
              index++;
            } else if (this.details[i].islemtipi === "3") {
              var date3 = moment(this.details[i].istektarihi);
              date3.locale("tr");
              this.details[i].istektarihi = moment(date3).format("LL");
            } else if (this.details[i].islemtipi === "4") {
              var date4 = moment(this.details[i].istektarih);
              date4.locale("tr");
              this.details[i].istektarih = moment(date4).format("LL");
            }
          }
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  getAreas(hastatc) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&hastatc=" +
      hastatc;

    this.saha.saha(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.saha.length; i++) {
          this.areas[i] = result.saha[i];
          var date = moment(this.areas[i].eklenmetarihi);
          date.locale("tr");
          this.areas[i].eklenmetarihi = moment(date).format("LL");
        }
      } else if (result.returncode === "4") {
        this.isEmptyArea = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  goAddArea(isDoctor: boolean) {
    let modal = this.modalCtrl.create("AddMeasurementPage", {
      isDoctor: isDoctor,
      hastatc: this.hastatc
    });
    modal.present();
  }

  goMeasure(id, data_name, size) {
    this.navCtrl.push("PatientHealthDataDetailsPage", {
      id: id,
      data_name: data_name,
      isDoctor: this.isDoctor,
      hastatc: this.hastatc,
      size: size
    });
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

  fabTapped(page, fab: FabContainer, style) {
    if (page === 1 && fab && style === 1) {
      this.showMenuItem = !this.showMenuItem;
      fab.close();
      this.navCtrl.push("AddExaminationPage", { hastatc: this.hastatc });
    } else if (page === 1 && fab && style === 2) {
      fab.close();
      this.navCtrl.push("AddExaminationPage", { hastatc: this.hastatc });
    }
    if (page === 2) {
      fab.close();
      this.navCtrl.push("AddManuelVisitPage", {
        hastatc: this.hastatc,
        isDoctor: true
      });
    }
  }

  showMenuItems() {
    this.showMenuItem = !this.showMenuItem;
  }

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: "Kullanıcı bilgisine ulaşılamadı",
      subTitle: "Yeniden giriş yapmak ister misiniz?",
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

  showAlert() {
    let alert = this.alertCtrl.create({
      title: "Yetki Yok!",
      subTitle:
        "Bu muayene size ait olmadığı için silme isteğinizi gerçekleştiremiyoruz.",
      buttons: ["Tamam"]
    });
    alert.present();
  }

  openImage(img) {
    let modal = this.modalCtrl.create("PreviewModalPage", { img: img });

    modal.present();
  }

  getOzgecmis() {
    var creds;

    if (this.type === 1) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "4" +
        "&hastatc=" +
        this.hastatc;
    } else if (this.type === 2) {
      creds =
        "token=" +
        localStorage.getItem("token") +
        "&action=" +
        "4" +
        "&hastatc=" +
        localStorage.getItem("tckimlik");
    }

    this.gecmis.gecmis(creds).subscribe(result => {
      if (result.returncode === "0") {
        for (var i = 0; i < result.gecmis.length; i++) {
          this.hastaliklar[i] = result.gecmis[i];
          var date = moment(this.hastaliklar[i].eklemetarihi);
          date.locale("tr");
          this.hastaliklar[i].eklemetarihi = moment(date).format("LL");
        }
      } else if (result.returncode === "4") {
        this.isEmptyOzgecmis = true;
      } else {
        this.presentToast(result.message);
      }
    });
  }

  deleteManuelVisit(id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&manuelvizitid=" +
      id;

    this.showLoader();

    this.manuel.manuel(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.events.publish("manuel", true);
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }

  getOwnExaminations() {

    if(localStorage.getItem("role") === "secretary"){

      var creds2 = "token=" + localStorage.getItem("token") + "&tckimlik=" + localStorage.getItem("tckimlik");

      this.getuser.getUser(creds2).subscribe(result => {

        if(result.returncode === "0"){
          var creds =
          "token=" +
          localStorage.getItem("token") +
          "&action=" +
          "4" +
          "&hastatc=" +
          this.hastatc +
          "&doktortc=" +
          result.userinfo[0].lastdoctor[0].doktortc;

        this.showLoader();

        this.visit.visit(creds).subscribe(
          result => {
            this.loading.dismiss();

            if (result.returncode === "0") {
              for (var i = 0; i < result.vizit.length; i++) {
                this.details[i] = result.vizit[i];

                if (this.details[i].islemtipi === "1") {
                  var date = moment(this.details[i].tarih);
                  date.locale("tr");
                  this.details[i].tarih = moment(date).format("LL");
                } else if (this.details[i].islemtipi === "2") {
                  var date2 = moment(this.details[i].tarih);
                  date2.locale("tr");
                  this.details[i].tarih = moment(date2).format("LL");
                } else if (this.details[i].islemtipi === "3") {
                  var date3 = moment(this.details[i].istektarihi);
                  date3.locale("tr");
                  this.details[i].istektarihi = moment(date3).format("LL");
                } else if (this.details[i].islemtipi === "4") {
                  var date4 = moment(this.details[i].istektarih);
                  date4.locale("tr");
                  this.details[i].istektarih = moment(date4).format("LL");
                }
              }
            } else if (result.returncode === "1") {
              this.doPrompt();
            } else {
              this.presentToast(result.message);
            }
          },
          err => {
            this.loading.dismiss();
            this.presentToast(err);
          }
        );
        }
        else{
          this.presentToast(result.message);
        }
      })
    }
    else{

      var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&hastatc=" +
      this.hastatc +
      "&doktortc=" +
      localStorage.getItem("tckimlik");

    this.showLoader();

    this.visit.visit(creds).subscribe(
      result => {
        this.loading.dismiss();

        if (result.returncode === "0") {
          for (var i = 0; i < result.vizit.length; i++) {
            this.details[i] = result.vizit[i];

            if (this.details[i].islemtipi === "1") {
              var date = moment(this.details[i].tarih);
              date.locale("tr");
              this.details[i].tarih = moment(date).format("LL");
            } else if (this.details[i].islemtipi === "2") {
              var date2 = moment(this.details[i].tarih);
              date2.locale("tr");
              this.details[i].tarih = moment(date2).format("LL");
            } else if (this.details[i].islemtipi === "3") {
              var date3 = moment(this.details[i].istektarihi);
              date3.locale("tr");
              this.details[i].istektarihi = moment(date3).format("LL");
            } else if (this.details[i].islemtipi === "4") {
              var date4 = moment(this.details[i].istektarih);
              date4.locale("tr");
              this.details[i].istektarih = moment(date4).format("LL");
            }
          }
        } else if (result.returncode === "1") {
          this.doPrompt();
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );

    }

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Liste Görünümü",
      buttons: [
        {
          text: "Sadece Kendi Muayenelerim",
          handler: () => {
            this.details = [{}];
            this.getOwnExaminations();
          }
        },
        {
          text: "Hepsini Göster",
          handler: () => {
            this.details = [{}];
            this.getVisit();
          }
        },
        {
          text: "Vazgeç",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  goUpdateUser(){
    this.navCtrl.push("UpdateProfilePage", { updateInfo: this.userinfo[0] })
  }

  presentActionSheetPicture() {
    let action = this.actionSheetCtrl.create({
      title: "Profil Resmi Seçin",
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
        let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath, tckimlik: this.userinfo[0].tckimlik });
        modal.present();
        modal.onDidDismiss(data => {
          if (data && data.reload) {
            this.getUser();
          }
        });
      },
      err => {
        console.log("Error: ", err);
      }
    );
  }
}
