import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HealthKitPage } from '../health/health-kit';

@Component({
  selector: 'page-health-main',
  templateUrl: 'health-main.html',
})

export class HealthMainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  itemTapped(page) {
    if(page === 1)
      {
        this.navCtrl.push(HealthMainPage)
      }
    if(page === 2)
      {
        this.navCtrl.push(HealthMainPage)
      }
    if(page === 3)
      {
        this.navCtrl.push(HealthMainPage)
      }
    if(page === 4)
      {
        this.navCtrl.push(HealthMainPage)
      }
    if(page === 5)
      {
        this.navCtrl.push(HealthKitPage)
      }

  }

}
