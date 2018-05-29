import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController
} from "ionic-angular";
import { SignUpProvider } from "../../../providers/auth/sign-up";
import { SetRoleProvider } from '../../../providers/set-role/set-role';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-add-secretary",
  templateUrl: "add-secretary.html"
})
export class AddSecretaryPage {
  loading: any;
  userData = {
    tckimlik: "",
    password: "",
    registrationtype: "tckimlik",
    name: "",
    surname: "",
    cellphone: "",
    photourl: "",
    birthdate: ""
  };
  resultData: any
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private signup: SignUpProvider,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    private setRole: SetRoleProvider,
    public alertCtrl: AlertController
  ) {
    this.form = formBuilder.group({
      firstName: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*"),
          Validators.required
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*"),
          Validators.required
        ])
      ],
      tckimlik: [
        "",
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern("[0-9]*"),
          Validators.required
        ])
      ],
      phone: [
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("[0-9]*"),
          Validators.required
        ])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      birthdate: ["", Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddSecretaryPage");
  }

  doSignUp() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.userData.tckimlik = this.form.get("tckimlik").value;
      this.userData.password = this.form.get("password").value;
      this.userData.name = this.form.get("firstName").value;
      this.userData.surname = this.form.get("lastName").value;
      this.userData.cellphone = this.form.get("phone").value;
      this.userData.birthdate = this.form.get("birthdate").value;

      var creds =
        "tckimlik=" +
        this.userData.tckimlik +
        "&password=" +
        this.userData.password +
        "&name=" +
        this.userData.name +
        "&surname=" +
        this.userData.surname +
        "&birthdate=" +
        this.userData.birthdate +
        "&cellphone=" +
        this.userData.cellphone;

      this.showLoader();
      this.signup.signup(creds).subscribe(
        result => {
          this.loading.dismiss();
          this.resultData = result;
          if (this.resultData.returncode === "0") {

            var creds = "token=" + localStorage.getItem("token") + "&tckimlik=" + this.userData.tckimlik + "&rolenames=" + "hasta,sekreter";

            this.setRole.setRole(creds).subscribe(result => {
              if(result.returncode === "0"){

                this.showAlert(this.userData.name, this.userData.surname);
                this.navCtrl.pop();

              }
              else{
                this.presentToast(result.message);
              }
            })

          } else {
            this.presentToast(this.resultData.message);
          }
        },
        err => {
          this.loading.dismiss();
          this.presentToast(err);
        }
      );
    } else {
      if (!this.form.controls.tckimlik.valid) {
        this.presentInvalidToast(1);
      } else if (!this.form.controls.password.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.firstName.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.lastName.valid) {
        this.presentInvalidToast(4);
      } else if (!this.form.controls.phone.valid) {
        this.presentInvalidToast(5);
      } else if (!this.form.controls.birthdate.valid) {
        this.presentInvalidToast(6);
      }
    }
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({});

    this.loading.present();
  }

  presentInvalidToast(errorcode) {

    if (errorcode === 1) {

      let toast = this.toastCtrl.create({
        message: 'Lütfen geçerli bir TC kimlik numarası giriniz.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();
    }
    else if (errorcode === 2) {

      let toast = this.toastCtrl.create({
        message: 'Şifre en az 6 karakterden oluşmalıdır.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();
    }
    else if (errorcode === 3) {

      let toast = this.toastCtrl.create({
        message: 'Lütfen geçerli bir isim giriniz.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();
    }
    else if (errorcode === 4) {

      let toast = this.toastCtrl.create({
        message: 'Lütfen geçerli bir soyisim giriniz.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();
    }
    else if (errorcode === 5) {

      let toast = this.toastCtrl.create({
        message: 'Lütfen geçerli bir cep telefonu giriniz.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();

    }
    else if (errorcode === 6) {

      let toast = this.toastCtrl.create({
        message: 'Lütfen geçerli bir doğum tarihi giriniz.',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });
      toast.present();
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  showAlert(name, surname) {
    let alert = this.alertCtrl.create({
      title: 'Sekreter Eklendi!',
      subTitle: name + ' ' + surname + ' sekreteriniz olarak eklendi.',
      buttons: ['Tamam']
    });
    alert.present();
  }

}
