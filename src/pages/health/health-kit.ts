import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Health, HealthQueryOptions, HealthStoreOptions, HealthDataType, HealthData } from '@ionic-native/health';

@Component({
  selector: 'page-health-kit',
  templateUrl: 'health-kit.html',
})

export class HealthKitPage {

  height: any;
  currentHeight = 'Veri yok';
  stepcount = 'Veri yok';
  workouts = [];

  constructor(private plt: Platform, private health: Health) {

    this.plt.ready().then(() => {
      this.health.isAvailable().then(available => {

        if(available) {
         var datatypes: HealthDataType = {

          read: ['height', 'steps', 'activity', 'calories.active', 'distance'],
          write: ['height', 'activity', 'calories.active', 'distance']

        }

        this.health.requestAuthorization(datatypes.read).then(_ => {

          this.loadHealthData();

        });
      }

      })

    });

  }

  saveHeight(){

    this.health.store({startDate: null, endDate: null, dataType: 'height', value: this.height, sourceName: 'Kisko', sourceBundleId: 'com.lemonsoft.ksk'}).then(_ => {
      this.health = null;
      this.loadHealthData();
    })

  }

  saveWorkout(){

  }

  loadHealthData(){

    this.health.query({startDate: null, endDate: null, dataType: 'height' }).then(val => {
      this.currentHeight = val.value;
    }, err => {
      console.log('boy bulunamadı!', err);
    });



  }
}
