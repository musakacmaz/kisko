import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NearestPage } from '../pharmacy/nearest'


@Component({
  selector: 'page-pharmacy',
  templateUrl: 'pharmacy.html',
})
export class PharmacyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyPage');
  }
itemTapped(event, page) {

      if(page === 1)
      {
        this.navCtrl.push(NearestPage);
      }

      }

}
