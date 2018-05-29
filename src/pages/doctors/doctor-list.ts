import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DoctorDetailsPage } from '../doctors/doctor-details';

@Component({
  selector: 'page-doctor-list',
  templateUrl: 'doctor-list.html'
})
export class DoctorListPage {

  doctors;
  speciality: {}

  isOn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.speciality = navParams.get("speciality");
    this.initializeDoctors();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorListPage');
  }

  initializeDoctors(){
    this.doctors = [
      'Mehmet Tonbul',
      'Ferhat Tamcı',
      'Musa Kaçmaz',
      'Sena Arıcı',
      'Mert Polat',
      'Adil Alpkoçak',
      'Okan Öztürkmenoğlu',
      'Ali Rıza Arıbaş',
      'Tuğçe Abacı',
      'Metin Kahveci',
      'Eren Sözen',
      'Emre Yavuz',
      'Ali Veli',
      'LeBron James',
      'Tony Parker',
      'Manu Ginobili',
      'Tim Duncan',
      'Kawhi Leonard'
    ];

  }

  getDoctors(ev) {
    // Reset items back to all of the items
    this.initializeDoctors();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.doctors = this.doctors.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemTapped(doctor_name){

    this.navCtrl.push(DoctorDetailsPage, {
      doctor_name: doctor_name
    });

  }

  getButtonText(): string {
    return `Switch ${ this.isOn ? 'Off' : 'On' }`;
  }
  setState(): void {
    this.isOn = !this.isOn;
  }

  toggleDetails() {
    this.isOn = !this.isOn;
  }


}
