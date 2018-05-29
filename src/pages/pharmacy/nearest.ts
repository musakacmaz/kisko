import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController ,LoadingController} from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-nearest',
  templateUrl: 'nearest.html'
})
export class NearestPage {
loading:any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 options : GeolocationOptions;
currentPos : Geoposition;
places : Array<any> ;
  constructor(public loadingcontroller:LoadingController,public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewDidLoad(){
    this.getUserPosition();

  }

getUserPosition(){
    this.showLoader();
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;
        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);
    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
}
addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.showNearbyResto(latLng).then((results : Array<any>)=>{
        this.places = results;
        for(let i = 0 ;i < results.length ; i++)
        {
            this.createMarker(results[i]);
        }
    },(status)=>console.log(status));

    this.addMarker();

}
addMarker(){
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter(),
    icon: iconBase + 'library_maps.png'

    });

    let content = "<p>Şuan Burdasınız!</p>";
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });
this.loading.dismiss();
}
showNearbyResto(latLng)
{
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius : 8047 ,
        types: ["pharmacy"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);
            }else
            {
                reject(status);
            }

        });
    });

}
createMarker(place)
{
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
    });
}
showLoader(){
this.loading=this.loadingcontroller.create({
    content:'Harita Yükleniyor',
    duration: 2000
});
this.loading.present();
}
}
