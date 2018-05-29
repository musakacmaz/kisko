import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpProvider } from '../../providers/auth/sign-up';
import { SmsValidateProvider } from '../../providers/auth/sms';
import { LoginService } from '../../providers/user/islogin';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  loading: any
  userData = {
    email: '',
    password: '',
    registrationtype: 'email',
    name: '',
    surname: '',
    cellphone: ''
  };
  resultData: any
  facebookData: any
  tabBarElement: any

  userName : Array<any>
  i: any

  form: FormGroup;
  submitAttempt: boolean = false

  newUserData: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public signup: SignUpProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder,
  private sms: SmsValidateProvider, private auth: AuthProvider, public islogin: LoginService) {

       this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

       this.facebookData = this.navParams.get("faceBookData")

       if(this.facebookData != null)
        {
          this.i = 0;
          this.userData.email = this.facebookData.email;
          this.userName = this.facebookData.displayName.split(' ');
          for(this.i; this.i < this.userName.length-1; this.i = this.i + 1)
            {
              this.userData.name = this.userData.name + ' ' + this.userName[this.i] + ' ';

            }
            this.userData.surname = this.userName[this.userName.length-1];

          this.userData.cellphone = this.facebookData.phoneNumber;
        }

        this.form = formBuilder.group({

          firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*'), Validators.required])],
          lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z-9ğüşöçıİĞÜŞÖÇ ]*'), Validators.required])],
          email: ['', Validators.compose( [Validators.pattern('^[A-Za-z0-9.]+@[A-Za-z0-9.]+$'), Validators.required])],
          phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
          password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
          password_again: ['', Validators.compose([Validators.required])]

      }, {validator: this.matchingPasswords('password', 'password_again')});

    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }


   doSignUp(){

    this.submitAttempt = true;

    if(this.form.valid){

      this.userData.email = this.form.get("email").value;
      this.userData.password = this.form.get("password").value;
      this.userData.name = this.form.get("firstName").value;
      this.userData.surname = this.form.get("lastName").value;
      this.userData.cellphone = this.form.get("phone").value;

      var creds = "email=" + this.userData.email + "&password=" + this.userData.password + "&registrationtype=" + this.userData.registrationtype + "&name=" + this.userData.name + "&surname=" + this.userData.surname + "&cellphone=" + this.userData.cellphone;

      this.showLoader();
      this.signup.signup(creds).subscribe((result) => {
      this.loading.dismiss();
      this.resultData = result;

          if(this.resultData.success === true)
          {
            var creds = "email=" + this.userData.email + "&password=" + this.userData.password;
            this.showLoader();
            this.auth.login(creds).subscribe((result) => {
              this.loading.dismiss();
              this.newUserData = result;

              console.log(this.userData)

              if(this.newUserData.success === true)
                {
                  this.doPrompt(this.newUserData.token, this.userData.name, this.userData.cellphone);
                }
                else{
                  this.presentErrToast();
                }
            }, (err) => {
              this.loading.dismiss();
              this.presentToast(err);
            });



          }
          else{
            this.presentErrToast();
          }

          /* */
      }, (err) => {
        this.loading.dismiss();
        this.presentErrToast();
      });

      }

      else{
        this.presentInvalidToast();
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

   presentErrToast() {
    let toast = this.toastCtrl.create({
      message: 'Kayıt başarısız!',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
   showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Bilgileriniz kontrol ediliyor...'
    });

    this.loading.present();
  }

  presentInvalidToast() {
    let toast = this.toastCtrl.create({
      message: 'Lütfen bilgileri eksiksiz giriniz',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  doSmsValidate(smsvalidationcode, token){

        var creds = "token=" + token + "&smsvalidationcode=" + smsvalidationcode;
        this.showLoader();
        this.sms.smsValidate(creds).subscribe((result) => {
        this.loading.dismiss();

        if(result.success === true){

          localStorage.setItem("loginsuccess", result.success);
          localStorage.setItem("token", token);
          localStorage.setItem("role", "0");

          this.islogin.loginState = true;
          this.navCtrl.popToRoot();
          this.presentSuccToast(this.userData.name);

          }
        }, (err) => {
          this.loading.dismiss();
          this.presentErrToast();
        });

      }

      doPrompt(token, name, phone) {
        let alert = this.alertCtrl.create({
          title: 'SMS Doğrulama',
          message: name + ', lütfen +90' + phone + ' numaralı telefona gönderdiğimiz 6 haneli onaylama kodunu gir',
          inputs: [
            {
              name: 'sms',
              type: 'number',
              value: ''
            }
          ],
          buttons: [
            {
              text: 'Vazgeç',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Tamam',
              handler: () => {
                this.doSmsValidate(alert.data.inputs[0].value, token);
                console.log('OK clicked');
                console.log(alert.data.inputs[0].value);
              }
            }
          ]
        });

        alert.present();
      }

      presentSuccToast(name) {
        let toast = this.toastCtrl.create({
          message: 'Hoşgeldin ' + name + ' :)',
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
