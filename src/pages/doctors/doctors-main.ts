import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DoctorListPage } from '../doctors/doctor-list';

@Component({
  selector: 'page-doctors-main',
  templateUrl: 'doctors-main.html'
})
export class DoctorsMainPage {

  specialities;
  isOn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeSpecialities();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorsMainPage');
  }

  initializeSpecialities() {
    this.specialities = [
      'Ağız ve Diş Sağlığı',
      'Aile Hekimliği',
      'Beyin ve Sinir Cerrahisi',
      'Beslenme ve Diyet',
      'Check-Up',
      'Çocuk Hastalıkları',
      'Dermatoloji',
      'Enfeksiyon Hastalıkları',
      'Fizik Tedavi ve Rehabilitasyon',
      'Genel Cerrahi',
      'Göz Hastalıkları',
      'Hemodiyaliz',
      'İç Hastalıkları',
      'Kalp ve Damar Cerrahisi',
      'Kadın Hastalıkları ve Doğum',
      'Kulak Burun Boğaz',
      'Laboratuvar Hizmetleri',
      'Mikrobiyoloji',
      'Nöroloji',
      'Ortopedi',
      'Plastik Cerrahi',
      'Radyoloji',
      'Saç Ekim Kliniği',
      'Tüp Bebek',
      'Üroloji',
      'Yeni Doğan Doğum Bakım',
    ];
  }

  getSpecialities(ev) {
    // Reset items back to all of the items
    this.initializeSpecialities();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.specialities = this.specialities.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemTapped(speciality){

    this.navCtrl.push(DoctorListPage, {
      speciality: speciality
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
