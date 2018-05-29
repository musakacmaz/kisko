import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-add-reminder",
  templateUrl: "add-reminder.html"
})
export class AddReminderPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

}
