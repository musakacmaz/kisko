import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DoctorMapPage } from '../doctors/doctor-map';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-doctor-details',
  templateUrl: 'doctor-details.html'
})
export class DoctorDetailsPage {

  doctor;
  doctor_name : {}

  videos: any[] = [
    {
      title: 'Bebeği Kundaklamak Sağlıklı Mıdır, Zararlı Mıdır?',
      url: 'https://www.youtube.com/embed/vf9QNLEAdFA',
    },
    {
      title: 'Antenatal Hidronefroz (Doğuştan Böbrek Büyümesi) Nedir?',
      url: 'https://www.youtube.com/embed/yDXr4QhPwc4',
    },
    {
      title: 'Bebeklerde Kalça Çıkıklığı Nedir, Belirtileri Nelerdir?',
      url: 'https://www.youtube.com/embed/R-CUyfgrvAs',
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public dom: DomSanitizer) {

    this.doctor_name = navParams.get("doctor_name");
    this.doctor = "hakkında";

  }

  itemTapped(){
     this.navCtrl.push(DoctorMapPage);
    }

    trustUrl(url){
      return this.dom.bypassSecurityTrustResourceUrl(url);
    }
}
