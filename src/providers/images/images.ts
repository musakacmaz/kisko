import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';

let apiUrl = 'http://kisko.net/apiv2/user_photoupload.php';

@Injectable()
export class UploadImageProvider {

  constructor(public http: Http, private transfer: FileTransfer) { }


  uploadImage(img, token) {

    var options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: img,
      chunkedMode: false,
      mimeType: 'form-data',
      headers: {},
      params: {
        'token': token
      }
    }

    const fileTransfer = this.transfer.create();


    return fileTransfer.upload(img, apiUrl, options);

  }

  UploadImage(photo, token) {

    var options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: photo,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: {
        'token': token
      }
    };

    const fileTransfer = this.transfer.create();

    return fileTransfer.upload(photo, apiUrl, options, true);
  }




}
