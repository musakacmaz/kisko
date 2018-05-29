import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-doctor-profile",
  templateUrl: "doctor-profile.html"
})
export class DoctorProfilePage {

  doctortc: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.doctortc = this.navParams.get("doctortc");
  }

  openPage(page) {
    if (page === 1) {
      this.navCtrl.push("DoctorPersonalPage", { doctortc: this.doctortc });
    } else if (page === 2) {
      this.navCtrl.push("DoctorCvPage", { doctortc: this.doctortc });
    } else if (page === 3) {
      this.navCtrl.push("DoctorTanitimPage", { doctortc: this.doctortc });
    } else if (page === 4) {
      this.navCtrl.push("DoctorInfoPage", { doctortc: this.doctortc });
    } else if (page === 5) {
      this.navCtrl.push("DoctorPaperPage", { doctortc: this.doctortc });
    } else if (page === 6) {
      this.navCtrl.push("DoctorVideoPage", { doctortc: this.doctortc });
    } else if (page === 7) {
      this.navCtrl.push("DoctorCommentPage", { doctortc: this.doctortc });
    }
  }
}
