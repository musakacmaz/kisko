import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { HttpModule } from '@angular/http';
import { AuthProvider } from '../providers/auth/auth'
import { GetUserProvider } from '../providers/user/get-user';
import { LogOutProvider } from '../providers/auth/log-out';
import { SignUpProvider } from '../providers/auth/sign-up';
import { UpdateUserProvider } from '../providers/user/update-user';
import { SocialLoginProvider } from '../providers/auth/social-auth';
import { SmsValidateProvider } from '../providers/auth/sms';
import { LoginService } from '../providers/user/islogin';
import { ForgotPasswordProvider } from '../providers/auth/forgot-password';
import { SetPasswordProvider } from '../providers/auth/set-password';

import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { DoctorsMainPage } from '../pages/doctors/doctors-main';
import { DoctorListPage } from '../pages/doctors/doctor-list';
import { DoctorDetailsPage } from '../pages/doctors/doctor-details';
import { DoctorMapPage } from '../pages/doctors/doctor-map';
import { PharmacyPage } from '../pages/pharmacy/pharmacy';
import { NearestPage } from '../pages/pharmacy/nearest';
import { HealthMainPage } from '../pages/health/health-main';
import { EmergencyPage } from '../pages/emergency/emergency';
import { SettingsPage } from '../pages/settings/settings';
import { UpdateProfilePage } from '../pages/profile/update-profile';
import { HealthKitPage } from '../pages/health/health-kit';
import { HomedocPage } from '../pages/homedoc/homedoc';
import { RecordpatientPage } from '../pages/homedoc/recordpatient/recordpatient';
import { EmuayenePage } from '../pages/homedoc/emuayene/emuayene';
import { CvPage } from '../pages/homedoc/cv/cv';
import { SupportPage } from '../pages/homedoc/support/support';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';

import { Facebook } from '@ionic-native/facebook';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

import { Health , HealthStoreOptions, HealthQueryOptions } from '@ionic-native/health'

var firebaseAuth = {
    apiKey: "AIzaSyDd8u3Rdc0hDJh5DiKBeJIDiO7-4bVkd7k",
    authDomain: "face-32c59.firebaseapp.com",
    databaseURL: "https://face-32c59.firebaseio.com",
    projectId: "face-32c59",
    storageBucket: "face-32c59.appspot.com",
    messagingSenderId: "1061402863868"

  };

export const firebaseConfig = {
apiKey: "AIzaSyDd8u3Rdc0hDJh5DiKBeJIDiO7-4bVkd7k",
    authDomain: "face-32c59.firebaseapp.com",
    databaseURL: "https://face-32c59.firebaseio.com",
    projectId: "face-32c59",
    storageBucket: "face-32c59.appspot.com",
    messagingSenderId: "1061402863868"

}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    NotificationsPage,
    ProfilePage,
    UpdateProfilePage,
    HomePage,
    MessagesPage,
    DoctorsMainPage,
    DoctorListPage,
    DoctorDetailsPage,
    DoctorMapPage,
    PharmacyPage,
    NearestPage,
    HealthMainPage,
    HealthKitPage,
    EmergencyPage,
    SettingsPage,
    HomedocPage,
    RecordpatientPage,
    EmuayenePage,
    CvPage,
    SupportPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp, {platforms: { ios:{backButtonText: 'Geri', okText : "Tamam"}, android:{backButtonIcon: 'ios-arrow-back', okText : "Tamam"}}, monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotificationsPage,
    LoginPage,
    SignUpPage,
    ProfilePage,
    UpdateProfilePage,
    HomePage,
    MessagesPage,
    DoctorsMainPage,
    DoctorListPage,
    DoctorDetailsPage,
    DoctorMapPage,
    PharmacyPage,
    NearestPage,
    HealthMainPage,
    HealthKitPage,
    EmergencyPage,
    SettingsPage,
    HomedocPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
    GetUserProvider,
    LogOutProvider,
    SignUpProvider,
    UpdateUserProvider,
    SocialLoginProvider,
    SmsValidateProvider,
    LoginService,
    ForgotPasswordProvider,
    SetPasswordProvider,
    Facebook,
    GooglePlus,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Health
  ]
})
export class AppModule {}
