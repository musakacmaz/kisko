import { Component } from '@angular/core';
import { IonicPage, Platform, ToastController, AlertController, NavController } from 'ionic-angular';
import { Health } from '@ionic-native/health';

@IonicPage()
@Component({
  selector: 'page-health-data',
  templateUrl: 'health-data.html',
})

export class HealthDataPage {

  types;

  constructor(private plt: Platform, private health: Health, public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController) {

    this.initializeTypes();

    this.plt.ready().then(() => {

      this.health.promptInstallFit();

    });

  }

  itemTapped(type) {

    this.navCtrl.push('HealthDataDetailsPage', {
      data_name: type
    });
  }

  loadHealthData(){

    this.health.query({
      startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      dataType: 'steps',
      filtered: true
    })
    .then(data => {
      this.presentAlert("endDate: " + data.endDate + "startDate: " + data.startDate + "sourcebundleID: " + data.sourceBundleId + "sourceName: " + data.sourceName + "unit: " + data.unit + "value: " + data.value);
    },
    err => {
      this.presentToast("steps not counted! " + err);
    });

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

  presentAlert(value){

    let alert = this.alertCtrl.create({
     title: 'Son 3 gündeki toplam adım',
     message: value,
     buttons: ['Tamam']
    });
    alert.present();
  }

  initializeTypes(){
    this.types = [
      'Adım',
      'Nabız',
      'Mesafe',
      'Kalori',
      'Aktivite',
      'Yağ Oranı',
      'Kan Şekeri'
    ];

  }

}
