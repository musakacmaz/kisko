import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { HomedocPage } from '../homedoc/homedoc';
import { AuthProvider } from '../../providers/auth/auth';
import { GetUserProvider } from '../../providers/user/get-user';
import { SocialLoginProvider } from '../../providers/auth/social-auth';
import { SignUpProvider } from '../../providers/auth/sign-up';
import { SmsValidateProvider } from '../../providers/auth/sms';
import { LoginService } from '../../providers/user/islogin';
import { ForgotPasswordProvider } from '../../providers/auth/forgot-password';
import { SetPasswordProvider } from '../../providers/auth/set-password';
import { SignUpPage } from '../signup/signup';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  userData: any
  loading: any
  loginData = { email: '', password: '' }
  userDataFacebook: { name: ''}
  FB_login_Status:any;
  userName:any;
  i:any;
  faceUserData = {
    email: '',
    password: '',
    registrationtype: 'facebook',
    name: '',
    surname: '',
    cellphone: ''
  };

  resultDataFacebook: any
  resultData: any
  newUserData: any
  tabBarElement: any
  faceLoginResult: any

  userInfo: any /* sms validasyonu gerekli mi? */
  smsValCode: any

  fbUserData: any
  fbLogin: any

  googleUserData = {

    email: '',
    password: '',
    registrationtype: 'google',
    name: '',
    surname: '',
    cellphone: '',
    imgurl: ''
  }

  resultDataGoogle: any
  fbGoogleData: any
  googleLogin: any

  googleId = 'com.googleusercontent.apps.981701586360-t9d01e7kq55jnq5bcdja61vc28n9e6nl';

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider,
  public loadingCtrl: LoadingController, private toastCtrl: ToastController, private social: SocialLoginProvider,
  public sign: SignUpProvider, private getUser: GetUserProvider, public alertCtrl: AlertController, private sms: SmsValidateProvider,
  public islogin: LoginService, private forgotPass: ForgotPasswordProvider, private setPass: SetPasswordProvider,
  private platform: Platform,private facebook: Facebook, private googlePlus: GooglePlus) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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

  doLogin() {
    var creds = "email=" + this.loginData.email + "&registrationtype=" + "email";
    this.showLoader();
    this.auth.login(creds).subscribe((result) => {
      this.loading.dismiss();
      this.userData = result;

      if(this.userData.success === true)
        {
          var creds = "token=" + this.userData.token;
          this.showLoader();
          this.getUser.getUser(creds).subscribe((result) => {
          this.loading.dismiss();

          if(result.success === true){

              this.userInfo = result.userinfo;

              if(this.userInfo.smsvalidated === "f") {

                this.doPrompt(this.userData.token, this.userInfo.name, this.userInfo.cellphone)

              }

              else {

                localStorage.setItem("loginsuccess", this.userData.success);
                localStorage.setItem("email", this.userData.email);
                localStorage.setItem("token", this.userData.token);

                if(this.userInfo.role === "0"){

                  localStorage.setItem("role", this.userInfo.role);
                  this.islogin.loginState = true;
                  this.navCtrl.popToRoot();
                  this.presentSuccToast(this.userData.name);

                  }

                else if(this.userInfo.role === "1"){

                  localStorage.setItem("role", this.userInfo.role);
                  this.islogin.loginState = true;
                  this.navCtrl.setRoot(HomedocPage);
                  this.navCtrl.popToRoot();

                  }
              }
            }
          }, (err) => {
            this.loading.dismiss();
            this.presentToast(err);
          });

        }
        else{
          this.presentErrToast();
        }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  doSmsValidate(token, smsvalidationcode){

    var creds = "token=" + token + "&smsvalidationcode=" + smsvalidationcode;
    this.showLoader();
    this.sms.smsValidate(creds).subscribe((result) => {
    this.loading.dismiss();

    if(result.success === true){

      localStorage.setItem("loginsuccess", result.success);
      localStorage.setItem("token", token);

      this.navCtrl.popToRoot();
      this.presentSuccToast(this.userData.name);

      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

  loginWithFb(){

    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {

      this.facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {

        this.fbUserData = {
          email: profile['email'],
          first_name: profile['first_name'],
          last_name: profile['last_name'],
          picture: profile['picture_large']['data']['url'],
          username: profile['name'],
          registrationtype: 'facebook'
        }
      })
    })

    var creds = "email=" + this.fbUserData.email + "&registrationtype=" + this.fbUserData.registrationtype;
    this.showLoader();
    this.auth.login(creds).subscribe((result) => {

      this.loading.dismiss();

      if(result.success === true){

        localStorage.setItem("token", result.token);
        localStorage.setItem("role", "0");
        localStorage.setItem("loginsuccess", result.success);
        this.islogin.loginState = true;
        this.navCtrl.popToRoot();
        this.presentSuccToast(this.fbUserData.first_name);

      }

      else {

        var creds = "email=" + this.fbUserData.email + "&name=" + this.fbUserData.first_name + "&surname=" + this.fbUserData.last_name +  "&registrationtype=" + this.fbUserData.registrationtype;
        this.showLoader();

        this.sign.signup(creds).subscribe((result) => {

          this.loading.dismiss();

          if(result.success === true){

            var creds = "email=" + this.fbUserData.email + "&registrationtype=" + this.fbUserData.registrationtype;
            this.showLoader();
            this.auth.login(creds).subscribe((result) => {
              this.loading.dismiss();

              if(result.success === true){

                localStorage.setItem("token", result.token);
                localStorage.setItem("role", "0");
                localStorage.setItem("loginsuccess", result.success);

                this.islogin.loginState = true;
                this.navCtrl.popToRoot();
                this.presentSuccToast(this.fbUserData.first_name);

              }
            }, (err) => {
              this.loading.dismiss();
              this.presentToast(err);
            });
          }
        }, (err) => {
          this.loading.dismiss();
          this.presentToast(err);
        });
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  loginWithGoogle(){

    /*else if(this.platform.is('android')){

      this.googleId = 'com.googleusercontent.apps.981701586360-0kq49i4sn1uetjjvul66eme9ac0qkj31';

    }*/

      this.googlePlus.login({'webClientId': 'com.googleusercontent.apps.981701586360-t9d01e7kq55jnq5bcdja61vc28n9e6nl'})
      .then(res => {

        this.googleUserData.email = res.email;
        this.googleUserData.name = res.givenName;
        this.googleUserData.surname = res.familyName;
        this.googleUserData.imgurl = res.imageUrl;

      var creds = "email=" + this.googleUserData.email + "&registrationtype=" + this.googleUserData.registrationtype;

      this.auth.login(creds).subscribe((result) => {

      this.resultDataGoogle = result;

      if(this.resultDataGoogle.success === true){

        localStorage.setItem("token", this.resultDataGoogle.token);
        localStorage.setItem("role", "0");
        localStorage.setItem("loginsuccess", this.resultDataGoogle.success);

        this.islogin.loginState = true;
        this.navCtrl.popToRoot();
        this.presentSuccToast(this.googleUserData.name);


      }

      else {

        var creds = "email=" + this.googleUserData.email + "&name=" + this.googleUserData.name + "&surname=" + this.googleUserData.surname +  "&registrationtype=" + this.googleUserData.registrationtype;

        this.sign.signup(creds).subscribe((result) => {

          this.newUserData = result;

          if(this.newUserData.success === true){

            var creds = "email=" + this.googleUserData.email + "&registrationtype=" + this.googleUserData.registrationtype;

            this.auth.login(creds).subscribe((result) => {

              this.googleLogin = result;

              if(this.googleLogin.success === true){

                localStorage.setItem("token", this.googleLogin.token);
                localStorage.setItem("role", "0");
                localStorage.setItem("loginsuccess", this.googleLogin.success);

                this.islogin.loginState = true;
                this.navCtrl.popToRoot();
                this.presentSuccToast(this.googleUserData.name);

              }
            }, (err) => {
              this.loading.dismiss();
              this.presentToast(err);
            });
          }
        }, (err) => {
          this.loading.dismiss();
          this.presentToast(err);
        });
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

    })
  }

  doForgotPassword(email){

    var creds = "email=" + email;
    this.showLoader();
    this.forgotPass.forgotPassword(creds).subscribe((result) => {
    this.loading.dismiss();

    if(result.success === true){

      this.doSetPasswordPrompt(email);
      }
    else{
      this.invalidEmail();
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

  doforgotPrompt() {
    let alert = this.alertCtrl.create({
      title: 'E-posta Doğrulama',
      message: 'Lütfen Kisko uygulamasına kayıt olduğunuz e-posta adresini girin',
      inputs: [
        {
          name: 'e-mail',
          type: 'email',
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
            this.doForgotPassword(alert.data.inputs[0].value);
            console.log('OK clicked');
          }
        }
      ]
    });

    alert.present();
  }

  doSetPasswordPrompt(email) {
    let alert = this.alertCtrl.create({
      title: 'SMS Doğrulama',
      message: 'Lütfen cep telefonunuza gelen onay kodunu ve yeni şifrenizi girin',
      inputs: [
        {
          name: 'sms',
          type: 'number',
          placeholder: 'SMS onay kodu',
          value: ''
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Yeni şifre',
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
            this.doSetPassword(email, alert.data.inputs[0].value, alert.data.inputs[1].value,);
            console.log('OK clicked');
          }
        }
      ]
    });

    alert.present();
  }

  doSetPassword(email, smsvalidationcode, password){

    var creds = "email=" + email + "&smsvalidationcode=" + smsvalidationcode + "&password=" + password;
    this.showLoader();
    this.setPass.setPassword(creds).subscribe((result) => {
    this.loading.dismiss();

    if(result.success === true){

      this.presentSuccessAlert(email);

      }
      else{
        this.invalidSms();
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }

  signupTapped(){

    this.navCtrl.push(SignUpPage);

  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Bilgileriniz kontrol ediliyor...'
    });

    this.loading.present();
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
      message: 'Giriş başarısız!',
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
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

  doPrompt(token, name, phone) {
    let alert = this.alertCtrl.create({
      title: 'SMS Doğrulama',
      message: name + ', lütfen +90' + phone + ' numaralı telefona gönderdiğimiz onay kodunu gir',
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
            this.doSmsValidate(token, alert.data.inputs[0].value);
            console.log('OK clicked');
            console.log(alert.data.inputs[0].value);
          }
        }
      ]
    });

    alert.present();
  }



  presentSuccessAlert(email){

    let alert = this.alertCtrl.create({
      title: 'Şifre sıfırlama başarılı!',
      message: email + ' e-posta hesabınızı ve yeni şifrenizi kullanarak giriş yapabilirsiniz',
      buttons: ['Tamam']
    });

    alert.present();

    }

    invalidEmail() {
      let toast = this.toastCtrl.create({
        message: 'E-posta adresi bulunamadı',
        duration: 3000,
        position: 'bottom',
        dismissOnPageChange: true
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }

    invalidSms() {
      let toast = this.toastCtrl.create({
        message: 'SMS onay kodu yanlış!',
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
