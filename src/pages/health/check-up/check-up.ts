import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../../providers/user/islogin';

@IonicPage()
@Component({
  selector: 'page-check-up',
  templateUrl: 'check-up.html',
})

export class CheckUpPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public islogin: LoginService) {


  }

  itemTapped(page) {
    if(page === 1)
      {
        this.navCtrl.push('CheckUpDetailsPage');
      }

  }

}
