import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  ToastController,
  AlertController,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { Chart } from "chart.js";
import { LoginService } from "../../../../providers/user/islogin";
import { Olcum2Provider } from "../../../../providers/olcum2/olcum2";
import { OlcumTakipProvider } from "../../../../providers/olcum-takip/olcum-takip";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-patient-health-data-details",
  templateUrl: "patient-health-data-details.html"
})
export class PatientHealthDataDetailsPage {
  @ViewChild("barCanvas") barCanvas: ElementRef;

  data_name: {};
  page_type: {};

  barChart: any;
  public visible: Boolean;
  public manual_visible: Boolean;

  id: any;
  isDoctor: boolean = false;
  hastatc: any;
  measurements: any[] = [{ formatted: "" }];
  isEmpty: boolean = false;
  isFollowing: boolean = false;
  size: any;
  takipId: any;

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public islogin: LoginService,
    public modalCtrl: ModalController,
    public events: Events,
    private olcum2: Olcum2Provider,
    private olcumtakip: OlcumTakipProvider
  ) {
    this.visible = true;
    this.data_name = navParams.get("data_name");
    this.page_type = navParams.get("page_type");
    this.id = this.navParams.get("id");
    this.isDoctor = this.navParams.get("isDoctor");
    this.size = this.navParams.get("size");
    this.hastatc = this.navParams.get("hastatc");

    this.getMeasurement(this.hastatc);
    this.checkIsFollowing(this.hastatc, this.id);

    this.events.subscribe("measurement", result => {
      //this.measurements = [{ formatted: "" }];
      this.getMeasurement(result);
    });

    this.events.subscribe("follow", result => {
      //this.measurements = [{ formatted: "" }];
      this.checkIsFollowing(result.hastatc, result.sahaid);
    });
  }

  ionViewDidLoad() {
    /*
    if (this.page_type === "auto_data") {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: [
            "Pazartesi",
            "Salı",
            "Çarşamba",
            "Perşembe",
            "Cuma",
            "Cumartesi",
            "Pazar"
          ],
          datasets: [
            {
              label: this.data_name,
              data: [12, 19, 3, 5, 2, 3, 5],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                },
                stacked: true
              }
            ]
          }
        }
      });
    }

    if (this.page_type === "manual_data") {
      this.manual_visible = true;
    }*/
  }

  getMeasurement(hastatc) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&sahaid=" +
      this.id +
      "&hastatc=" +
      hastatc;

    this.olcum2.olcum2(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.isEmpty = false;
          for (var i = 0; i < result.olcum.length; i++) {
            this.measurements[i] = result.olcum[i];

            var date = moment(this.measurements[i].olcumzamani);
            date.locale("tr");
            this.measurements[i].formatted = moment(date).format("LLL");
          }
        } else if (result.returncode === "4") {
          this.isEmpty = true;
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        alert(err);
      }
    );
  }

  addData(data_name) {
    let modal = this.modalCtrl.create("AddHealthDataPage", {
      id: this.id,
      data_name: this.data_name,
      size: this.size,
      hastatc: this.hastatc,
      isDoctor: this.isDoctor
    });
    modal.present();
  }

  followData() {
    let modal = this.modalCtrl.create("FollowDataPage", {
      id: this.id,
      data_name: this.data_name,
      hastatc: this.hastatc
    });
    modal.present();
  }

  updateData(value, date, id) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "2" +
      "&deger=" +
      value +
      "&olcumzamani=" +
      date +
      "&hastatc=" +
      this.hastatc +
      "&olcumid=" +
      id;

    this.olcum2.olcum2(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.getMeasurement(this.hastatc);
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
      "&hastatc=" +
      this.hastatc +
      "&olcumid=" +
      id;

    this.olcum2.olcum2(creds).subscribe(
      result => {
        if (result.returncode === "0") {
          this.getMeasurement(this.hastatc);
        } else {
          this.presentToast(result.message);
        }
      },
      err => {
        alert(err);
      }
    );
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

  showPrompt(value, birim, date, id) {
    let prompt = this.alertCtrl.create({
      title: "Ölçüm Güncelleme",
      message: "Lütfen yeni değeri giriniz.",
      inputs: [
        {
          name: "title",
          type: "",
          placeholder: value + " " + birim,
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
            this.updateData(prompt.data.inputs[0].value, date, id);
          }
        }
      ]
    });
    prompt.present();
  }

  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: "Veriyi silmek istediğinize emin misiniz?",
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

  checkIsFollowing(hastatc, sahaid) {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "4" +
      "&hastatc=" +
      hastatc +
      "&doktortc=" +
      localStorage.getItem("tckimlik") +
      "&sahaid=" +
      sahaid;

    this.olcumtakip.olcumtakip(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.isFollowing = true;
        this.takipId = result.olcumtakip[0].olcumtakipid;
      }
    });
  }

  showFollowConfirm() {
    let confirm = this.alertCtrl.create({
      title: "Takibi bırakmak istediğinize emin misiniz?",
      buttons: [
        {
          text: "Vazgeç",
          handler: () => {}
        },
        {
          text: "Evet, Eminim",
          handler: () => {
            this.unfollowData();
          }
        }
      ]
    });
    confirm.present();
  }

  unfollowData() {
    var creds =
      "token=" +
      localStorage.getItem("token") +
      "&action=" +
      "3" +
      "&olcumtakipid=" +
      this.takipId;

    this.olcumtakip.olcumtakip(creds).subscribe(result => {
      if (result.returncode === "0") {
        this.isFollowing = false;
      } else {
        this.presentToast(result.message);
      }
    });
  }
}
