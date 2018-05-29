import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateUserProvider } from '../../providers/user/update-user';

@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html'
})



export class UpdateProfilePage {

  loading: any
  updateInfo: any

  femaleselected: boolean = false
  maleselected: boolean = false

  form: FormGroup;
  submitAttempt: boolean = false

  resultData: any
  tabBarElement: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private updateUser: UpdateUserProvider,
  public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public formBuilder: FormBuilder) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.updateInfo = this.navParams.get("updateInfo");


    if(this.updateInfo.gender === "Kadın" || this.updateInfo.gender === "kadın")
      {
        this.femaleselected = true;
        this.maleselected = false;
      }
    else if(this.updateInfo.gender === "Erkek" || this.updateInfo.gender === "erkek")
      {
        this.femaleselected = false;
        this.maleselected = true;
      }

      this.form = formBuilder.group({
        firstName: [this.updateInfo.name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*'), Validators.required])],
        lastName: [this.updateInfo.surname, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*'), Validators.required])],
        address: [this.updateInfo.address, Validators.compose([Validators.minLength(5)])],
        city: [this.updateInfo.city , Validators.compose( [Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*')])],
        country: [this.updateInfo.country , Validators.compose( [Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*')])],
        gender: [this.updateInfo.gender],
        birthdate: [this.updateInfo.birthdate],
        birthplace: [this.updateInfo.birthplace, Validators.compose( [Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*')])],
        email: [this.updateInfo.email, Validators.compose( [Validators.pattern('^[A-Za-z0-9.]+@[A-Za-z0-9.]+$'), Validators.required])],
        phone: [this.updateInfo.cellphone, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],
    });
  }



  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  doUpdateUser(){

    this.submitAttempt = true;

    if(this.form.valid){

      this.updateInfo.email = this.form.get("email").value;
      this.updateInfo.name = this.form.get("firstName").value;
      this.updateInfo.surname = this.form.get("lastName").value;
      this.updateInfo.address = this.form.get("address").value;
      this.updateInfo.city = this.form.get("city").value;
      this.updateInfo.country = this.form.get("country").value;
      this.updateInfo.gender = this.form.get("gender").value;
      this.updateInfo.cellphone = this.form.get("phone").value;
      this.updateInfo.birthdate  = this.form.get("birthdate").value;
      this.updateInfo.birthplace = this.form.get("birthplace").value;

      var creds = "token=" + localStorage.getItem("token")  + "&name=" + this.updateInfo.name + "&surname=" + this.updateInfo.surname + "&address=" + this.updateInfo.address + "&city=" + this.updateInfo.city + "&country=" + this.updateInfo.country + "&gender=" + this.updateInfo.gender + "&geolocation=" + this.updateInfo.geolocation + "&birthdate=" + this.updateInfo.birthdate + "&birthplace=" + this.updateInfo.birthplace + "&cellphone=" + this.updateInfo.cellphone;

          this.showLoader();
          this.updateUser.updateUser(creds).subscribe((result) => {
          this.loading.dismiss();
          this.resultData = result;

          console.log(this.resultData)
              if(this.resultData.success === true)
              {
                this.presentSuccToast();
                this.navCtrl.pop();
              }

          }, (err) => {
            this.loading.dismiss();
            this.presentErrToast();
          });

      }


  }

  showLoader(){

    this.loading = this.loadingCtrl.create({
        content: 'Bilgileriniz güncelleniyor...'
    });

    this.loading.present();

  }

  presentErrToast() {
    let toast = this.toastCtrl.create({
      message: 'Kullanıcı bilgisi güncellenemedi!',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentSuccToast() {
    let toast = this.toastCtrl.create({
      message: 'Bilgileriniz başarıyla güncellendi',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
