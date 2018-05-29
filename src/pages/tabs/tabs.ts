import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController} from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { HomedocPage } from '../homedoc/homedoc';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any
  tab2Root: any
  tab3Root: any

  loading: any
  userRole: any

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

    if(localStorage.getItem("token") === null){

        this.tab1Root = HomePage;
        this.tab2Root = NotificationsPage;
        this.tab3Root = SettingsPage;

      }

      else {

        if(localStorage.getItem("role") === "0"){

          this.tab1Root = HomePage;
          this.tab2Root = NotificationsPage;
          this.tab3Root = SettingsPage;

        }

        else if (localStorage.getItem("role") === "1"){

          this.tab1Root = HomedocPage;
          this.tab2Root = NotificationsPage;
          this.tab3Root = SettingsPage;

        }
      }
    }

  }



