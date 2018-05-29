import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController,
  Events
} from "ionic-angular";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UpdateUserProvider } from "../../../providers/user/update-user";

@IonicPage()
@Component({
  selector: "page-update-profile",
  templateUrl: "update-profile.html"
})
export class UpdateProfilePage {
  loading: any;
  updateInfo: any[] = [
    {
      tckimlik: "",
      deviceid: "",
      playerid: "",
      userid: "",
      name: "",
      surname: "",
      address: "",
      city: "",
      country: "",
      gender: "",
      birthdate: "",
      birthplace: "",
      email: "",
      cellphone: "",
      homephone: "",
      emailvalidated: "",
      smsvalidated: "",
      photourl: "",
      registerdate: "",
      meslek: ""
    }
  ];

  femaleselected: boolean = false;
  maleselected: boolean = false;

  form: FormGroup;
  submitAttempt: boolean = false;

  resultData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private updateUser: UpdateUserProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public events: Events
  ) {
    this.updateInfo[0] = this.navParams.get("updateInfo");

    if (
      this.updateInfo[0].gender === "Kadın" ||
      this.updateInfo[0].gender === "kadın"
    ) {
      this.femaleselected = true;
      this.maleselected = false;
    } else if (
      this.updateInfo[0].gender === "Erkek" ||
      this.updateInfo[0].gender === "erkek"
    ) {
      this.femaleselected = false;
      this.maleselected = true;
    }

    if (this.updateInfo[0].address === "null") {
      this.updateInfo[0].address = "";
    }
    if (this.updateInfo[0].city === "null") {
      this.updateInfo[0].city = "";
    }
    if (this.updateInfo[0].country === "null") {
      this.updateInfo[0].country = "";
    }
    if (this.updateInfo[0].birthplace === "null") {
      this.updateInfo[0].birthplace = "";
    }
    if (this.updateInfo[0].meslek === "null") {
      this.updateInfo[0].meslek = "";
    }
    if (this.updateInfo[0].email === "null") {
      this.updateInfo[0].email = "";
    }
    if (this.updateInfo[0].homephone === "null") {
      this.updateInfo[0].homephone = "";
    }

    this.form = formBuilder.group({
      firstName: [
        this.updateInfo[0].name,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*"),
          Validators.required
        ])
      ],
      lastName: [
        this.updateInfo[0].surname,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*"),
          Validators.required
        ])
      ],
      address: [
        this.updateInfo[0].address,
        Validators.compose([Validators.minLength(5)])
      ],
      city: [
        this.updateInfo[0].city,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*")
        ])
      ],
      country: [
        this.updateInfo[0].country,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*")
        ])
      ],
      gender: [this.updateInfo[0].gender],
      birthdate: [this.updateInfo[0].birthdate],
      birthplace: [
        this.updateInfo[0].birthplace,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*")
        ])
      ],
      meslek: [
        this.updateInfo[0].meslek,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*")
        ])
      ],
      email: [
        this.updateInfo[0].email,
        Validators.compose([
          Validators.pattern("^[A-Za-z0-9.]+@[A-Za-z0-9.]+$")
        ])
      ],
      phone: [
        this.updateInfo[0].cellphone,
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("[0-9]*")
        ])
      ],
      homephone: [
        this.updateInfo[0].homephone,
        Validators.compose([Validators.pattern("[0-9]*")])
      ]
    });
  }

  doUpdateUser() {
    this.submitAttempt = true;

    if (this.form.valid) {
      this.updateInfo[0].email = this.form.get("email").value;
      this.updateInfo[0].name = this.form.get("firstName").value;
      this.updateInfo[0].surname = this.form.get("lastName").value;
      this.updateInfo[0].address = this.form.get("address").value;
      this.updateInfo[0].city = this.form.get("city").value;
      this.updateInfo[0].country = this.form.get("country").value;
      this.updateInfo[0].gender = this.form.get("gender").value;
      this.updateInfo[0].cellphone = this.form.get("phone").value;
      this.updateInfo[0].homephone = this.form.get("homephone").value;
      this.updateInfo[0].birthdate = this.form.get("birthdate").value;
      this.updateInfo[0].birthplace = this.form.get("birthplace").value;
      this.updateInfo[0].meslek = this.form.get("meslek").value;

      var creds =
        "token=" +
        localStorage.getItem("token") +
        "&tckimlik=" +
        this.updateInfo[0].tckimlik +
        "&email=" +
        this.updateInfo[0].email +
        "&name=" +
        this.updateInfo[0].name +
        "&surname=" +
        this.updateInfo[0].surname +
        "&address=" +
        this.updateInfo[0].address +
        "&city=" +
        this.updateInfo[0].city +
        "&country=" +
        this.updateInfo[0].country +
        "&gender=" +
        this.updateInfo[0].gender +
        "&geolocation=" +
        this.updateInfo[0].geolocation +
        "&birthdate=" +
        this.updateInfo[0].birthdate +
        "&birthplace=" +
        this.updateInfo[0].birthplace +
        "&meslek=" +
        this.updateInfo[0].meslek +
        "&cellphone=" +
        this.updateInfo[0].cellphone +
        "&homephone=" +
        this.updateInfo[0].homephone;

      this.showLoader();
      this.updateUser.updateUser(creds).subscribe(
        result => {
          this.loading.dismiss();
          this.resultData = result;

          if (this.resultData.returncode === "0") {
            this.events.publish("profile:updated", true);
            this.navCtrl.pop();
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
      if (!this.form.controls.email.valid) {
        this.presentInvalidToast(1);
      } else if (!this.form.controls.firstName.valid) {
        this.presentInvalidToast(2);
      } else if (!this.form.controls.lastName.valid) {
        this.presentInvalidToast(3);
      } else if (!this.form.controls.address.valid) {
        this.presentInvalidToast(4);
      } else if (!this.form.controls.city.valid) {
        this.presentInvalidToast(5);
      } else if (!this.form.controls.country.valid) {
        this.presentInvalidToast(6);
      } else if (!this.form.controls.gender.valid) {
        this.presentInvalidToast(7);
      } else if (!this.form.controls.birthdate.valid) {
        this.presentInvalidToast(8);
      } else if (!this.form.controls.birthplace.valid) {
        this.presentInvalidToast(9);
      } else if (!this.form.controls.meslek.valid) {
        this.presentInvalidToast(10);
      } else if (!this.form.controls.phone.valid) {
        this.presentInvalidToast(11);
      } else if (!this.form.controls.homephone.valid) {
        this.presentInvalidToast(12);
      }
    }
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
  presentInvalidToast(errorcode) {
    if (errorcode === 1) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir e-posta adresi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 2) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir isim giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 3) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir soyisim giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 4) {
      let toast = this.toastCtrl.create({
        message: "Adres bilgisi 5 karakterden fazla olmalıdır.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 5) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir şehir giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 6) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir ülke giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 7) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir cinsiyet giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 8) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir doğum tarihi giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 9) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir doğum yeri giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 10) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir meslek giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    } else if (errorcode === 11) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir cep telefonu giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    }
    else if (errorcode === 12) {
      let toast = this.toastCtrl.create({
        message: "Lütfen geçerli bir ev telefonu giriniz.",
        duration: 3000,
        position: "bottom",
        dismissOnPageChange: true
      });
      toast.present();
    }
  }
}
