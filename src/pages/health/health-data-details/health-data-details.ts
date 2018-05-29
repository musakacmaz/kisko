import { Component, ViewChild } from '@angular/core';
import { IonicPage, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';
import { Health } from '@ionic-native/health';
import { Chart } from 'chart.js';
import { LoginService } from '../../../providers/user/islogin';

@IonicPage()
@Component({
  selector: 'page-health-data-details',
  templateUrl: 'health-data-details.html',
})

export class HealthDataDetailsPage {

  @ViewChild('barCanvas') barCanvas;

  height: any;
  currentHeight = 'Veri yok';
  workouts = [];

  data_name: {}
  barChart: any;

  constructor(private health: Health, public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public islogin: LoginService) {


    this.data_name = navParams.get("data_name");
    /*
        this.plt.ready().then(() => {

          this.health.isAvailable().then((available: boolean) => {

            if(available){

              this.health.requestAuthorization([
                'steps', 'distance', //read and write permissions
                 {
                   read: ['steps'], //read onyl permission
                   write: ['height', 'weight'] //write only permission
                 }
                  ])
                 .then((res) => {

                  this.presentToast("authorization done! " + res);

                  this.health.query({
                    startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    dataType: 'steps',
                    filtered: true
                  })
                  .then((data) => {
                    this.presentAlert(JSON.stringify(data));
                  },
                  err => {
                    this.presentToast("steps not counted! " + err);
                  });

                 })
                 .catch(e => this.presentToast("authorization NOT done! " + e));

            }


            })
            .catch(e => this.presentToast("health not available! " + e));

        });*/

  }

  ionViewDidLoad() {

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            stacked: true
          }]
        }
      }

    });

  }

  loadHealthData() {

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

  presentAlert(value) {

    let alert = this.alertCtrl.create({
      title: 'Son 3 gündeki toplam adım',
      message: value,
      buttons: ['Tamam']
    });
    alert.present();
  }

}
