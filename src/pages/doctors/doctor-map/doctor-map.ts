import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-doctor-map',
  templateUrl: 'doctor-map.html'
})

export class DoctorMapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
  public geolocation: Geolocation){
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    let userlatLng: any;


    this.geolocation.getCurrentPosition().then((position) => {

      userlatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
    });

    let latLng = new google.maps.LatLng(38.432487, 27.142213);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker();

  }

  addMarker(){

  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
  });

}

getUser(){


  }
}



