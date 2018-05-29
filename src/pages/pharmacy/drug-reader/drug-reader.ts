import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner'

@IonicPage()
@Component({
  selector: 'page-drug-reader',
  templateUrl: 'drug-reader.html',
})
export class DrugReaderPage {

  qrData = null;
  scannedCode = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcode: BarcodeScanner) {
  }

  scanCode(){

    this.barcode.scan({
      showFlipCameraButton : true,
      showTorchButton : true,
      prompt : "Tarama alanı içine bir barkod yerleştirin."
    }).then(barcodeData => {
      this.scannedCode = barcodeData.text;
    });
  }

}
