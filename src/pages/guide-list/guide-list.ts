import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-guide-list',
  templateUrl: 'guide-list.html',
})
export class GuideListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  itemTapped(guide){

    if(guide === 1){
      let modal = this.modalCtrl.create('GuideDetailsPage', {guide_id: guide});
      modal.present();
    }

  }

}
