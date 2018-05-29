import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-doctor-video-detail',
  templateUrl: 'doctor-video-detail.html',
})
export class DoctorVideoDetailPage {

  public videoInfo: any = {"videos": [{"id": 0, "title": "Protez Diş Nasıl Yapılır?", "like": 3, "view": 3, "stars": 3, "date": "23/10/2017"}]}
  videos: any;
  star: number = 0;
  Arr = Array;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.videos = this.videoInfo.videos[navParams.data];
    this.star = 5 - this.videos.stars;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorVideoDetailPage');
  }

  editVideo(id) {
    this.navCtrl.push('DoctorVideoAddPage', id);
  }

}
