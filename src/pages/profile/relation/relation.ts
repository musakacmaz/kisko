import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelationUserProvider } from '../../../providers/user/relation-user';

@IonicPage()
@Component({
  selector: 'page-relation',
  templateUrl: 'relation.html',
})
export class RelationPage {
  relations: any;
  relationInfo: any;
  relationNumber;
  tcno: any;
  loading: any
  form: FormGroup;
  submitAttempt: boolean = false

  resultData: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private relationUser: RelationUserProvider,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public formBuilder: FormBuilder, public events: Events) {

    this.relationInfo = this.navParams.get("updateInfo");
    this.relations = this.navParams.get("relationslist");
    this.form = formBuilder.group({
      tcno: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]*'), Validators.required])],
      permission: [this.relationInfo.permission]
    });

  }
  makeRelation() {
    this.relationInfo.tcno = this.form.get("tcno").value;
    this.relationInfo.permission = this.form.get("permission").value;


    var creds = "token=" + localStorage.getItem("token") + "&relationtype=" + this.relationInfo.relationtype + "&othertckimlik=" + this.relationInfo.tcno + "&readpermission=" + this.relationInfo.permission;
    this.showLoader();
    this.relationUser.updateUser(creds).subscribe((result) => {
      this.loading.dismiss();
      this.resultData = result;
      if (this.resultData.returncode === "0") {
        this.presentToast(this.resultData.message);
        this.navCtrl.pop();
      }
      else {
        this.presentErrToast(this.resultData.message);
        this.loading.dismiss();
      }
    }, (err) => {
      this.loading.dismiss();
    });

  }
  doUpdateUser() {
    this.submitAttempt = true;
  }

  showLoader() {

    this.loading = this.loadingCtrl.create({});
    this.loading.present();
  }

  presentErrToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
