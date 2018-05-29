import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../../providers/user/islogin';

@IonicPage()
@Component({
  selector: 'page-check-up-details',
  templateUrl: 'check-up-details.html',
})

export class CheckUpDetailsPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public islogin: LoginService) {


  }

}
