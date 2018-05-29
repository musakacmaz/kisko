import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateRelationProvider } from '../../../providers/user/update-relation';
import { DeleteRelationProvider } from '../../../providers/user/delete-relation';

@IonicPage()
@Component({
  selector: 'page-update-relation',
  templateUrl: 'update-relation.html',
})
export class UpdateRelationPage {
  relationInfo: any;
  submitAttempt: boolean = false
  resultData: any
  form: FormGroup;
  relationNumber;
  loading: any
  tcno: any;
  relations: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private relationUser: UpdateRelationProvider,
    private deleteRelations: DeleteRelationProvider,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.relationInfo = this.navParams.get("updateInfo");
    this.relations = this.navParams.get("relationslist");
  }
  UpdateRelation() {

    var creds = "token=" + localStorage.getItem("token") + "&relationtype=" + this.relationInfo.relationtype + "&othertckimlik=" + this.relationInfo.tckimlik + "&readpermission=" + this.relationInfo.readpermission;

    this.showLoader();
    this.relationUser.updateUser(creds).subscribe((result) => {
      this.resultData = result;
      if (this.resultData.returncode === "0") {
        this.presentToast(this.resultData.message);
        this.navCtrl.pop();
        this.loading.dismiss();
      }
      else {
        this.presentToast(this.resultData.message);
        this.loading.dismiss();
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });

  }
  deleteRelation() {

    var creds = "token=" + localStorage.getItem("token") + "&othertckimlik=" + this.relationInfo.tckimlik;
    this.showLoader();

    this.deleteRelations.deleteUser(creds).subscribe((result) => {

      this.resultData = result;
      if (this.resultData.returncode === "0") {
        this.loading.dismiss();
        this.presentToast(this.resultData.message);
        this.navCtrl.pop();
      }
    }, (err) => {
      this.presentToast(err);
      this.loading.dismiss();
    });

  }
  showLoader() {

    this.loading = this.loadingCtrl.create({});

    this.loading.present();

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
