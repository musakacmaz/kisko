import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SmsValidateProvider } from "../../../providers/auth/sms";
import { LoginService } from "../../../providers/user/islogin";
import { AuthProvider } from "../../../providers/auth/auth";
import { SmsResendProvider } from "../../../providers/auth/sms-resend";
import { GetUserProvider } from "../../../providers/user/get-user";
import { NotificationListProvider } from "../../../providers/user/notification-list";

@IonicPage()
@Component({
  selector: "page-smsvalidate",
  templateUrl: "smsvalidate.html"
})
export class SmsValidatePage {
  loading: any;

  userInfo: any;
  loginInfo: any;
  logininfo: any;
  userData: any;
  resultData: any;

  loginCode : any = "1";

  readCount = 0;

  notificationInfo: any[] = [
    {
      notificationid: "",
      message: "",
      title: "",
      approved: "",
      approvedate: "",
      date: "",
      tckimlik: "",
      othertckimlik: "",
      imageurl: "",
      read: "",
      readdate: "",
      typeid: ""
    }
  ];

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private sms: SmsValidateProvider,
    public toastCtrl: ToastController,
    private auth: AuthProvider,
    public islogin: LoginService,
    public formBuilder: FormBuilder,
    private smsResend: SmsResendProvider,
    private getUser: GetUserProvider,
    private notificationList: NotificationListProvider,
    private events: Events
  ) {
    this.userInfo = this.navParams.get("userData");

    this.form = formBuilder.group({
      sms: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.required
        ])
      ]
    });
  }

  ionViewDidLoad() {
  }
  doSmsValidate() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.userInfo.smsvalidationcode = this.form.get("sms").value;

      var creds =
        "tckimlik=" +
        this.userInfo.tckimlik +
        "&smsvalidationcode=" +
        this.userInfo.smsvalidationcode;
      this.showLoader();
      this.sms.smsValidate(creds).subscribe(
        result => {
          this.loading.dismiss();

          if (result.returncode === "0") {
            this.doLogin(this.userInfo.tckimlik, this.userInfo.password);
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
    else {
      this.presentInvalid();
    }
  }

  doResendSMS() {
    var creds = "tckimlik=" + this.userInfo.tckimlik;
    this.showLoader();
    this.smsResend.smsResend(creds).subscribe(
      result => {
        this.loading.dismiss();
        if (result.returncode === "0") {
          this.presentToast(result.message);
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

  presentInvalid() {
    let toast = this.toastCtrl.create({
      message: "SMS doğrulama kodu 6 haneli olmalıdır.",
      duration: 3000,
      position: "bottom",
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  updateBadge() {
    var creds = "token=" + localStorage.getItem("token");
    this.notificationList.list(creds).subscribe(
      result => {
        this.resultData = result.notificationlist;

        if (result.returncode === "0") {
          for (var index = 0; index < this.resultData.length; index++) {
            this.notificationInfo[index] = this.resultData[index];
            if (this.notificationInfo[index].read !== "true") {
              this.readCount++;
            }
          }

          this.events.publish("cart:updated", this.readCount);
        }
      },
      err => {
        this.loading.dismiss();
      }
    );
  }

  doLogin(tckimlik, password) {
    var creds =
      "tckimlik=" +
      tckimlik +
      "&password=" +
      password +
      "&deviceid=" +
      this.islogin.deviceId +
      "&playerid=" +
      this.islogin.playerId +
      "&logintype=" +
      "mobil";

    this.showLoader();
    this.auth.login(creds).subscribe(
      result => {
        this.loading.dismiss();
        this.userData = result;

        if (this.userData.returncode === "0") {
          localStorage.setItem("token", this.userData.token);
          localStorage.setItem("tckimlik", tckimlik);

          var creds =
            "token=" +
            this.userData.token +
            "&tckimlik=" +
            tckimlik;
          this.showLoader();
          this.getUser.getUser(creds).subscribe(
            result => {
              this.loading.dismiss();

              if (result.returncode === "0") {
                if (result.userinfo[0].roles === null) {
                  this.presentToast("Sistemde rolünüz bulunmamaktadır!");
                  localStorage.clear();
                } else {
                  for (var i = 0; i < result.userinfo[0].roles.length; i++) {
                    if (result.userinfo[0].roles[i].rolenames === "doktor") {
                      this.loginCode = "2";
                    }
                  }

                  if (this.loginCode === "1") {
                    if (!result.userinfo[0].photourl) {
                      this.islogin.avatar = "assets/image/person.jpg";
                    } else {
                      this.islogin.avatar = result.userinfo[0].photourl;
                      this.islogin.isLoaded = true;
                    }

                    this.updateBadge();
                    localStorage.setItem("role", "patient");
                    this.islogin.loginState = true;
                    this.islogin.role = "patient";
                    this.navCtrl.popToRoot();
                  } else if (this.loginCode === "2") {
                    if (!result.userinfo[0].photourl) {
                      this.islogin.avatar = "assets/image/person.jpg";
                    } else {
                      this.islogin.avatar = result.userinfo[0].photourl;
                      this.islogin.isLoaded = true;
                    }

                    this.updateBadge();
                    localStorage.setItem("role", "doctor");
                    this.islogin.loginState = true;
                    this.islogin.role = "doctor";
                    this.islogin.tabIcon = "calendar";
                    this.islogin.tabTitle = "Profil";
                    this.navCtrl.setRoot("DoctorHomePage");
                    this.navCtrl.popToRoot();
                    this.events.publish("doctor", true);
                  } else {
                    this.presentToast("Kullanıcı bulunamadı!!!!");
                    localStorage.clear();
                  }
                }
              } else {
                this.presentToast(result.message);
              }
            },
            err => {
              this.loading.dismiss();
              this.presentToast(err);
            }
          );
        } else {
          this.presentToast(this.userData.message);
        }
      },
      err => {
        this.loading.dismiss();
        this.presentToast(err);
      }
    );
  }
}
