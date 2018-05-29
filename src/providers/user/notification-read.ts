import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = 'http://kisko.net/apiv2/notification_read.php';

@Injectable()
export class NotificationReadProvider {

  constructor(public http: Http) {
    console.log('Hello SignUpProvider ');
  }

  senddata(credentials){

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let response = this.http.post(apiUrl, credentials, {headers: headers}).map(res => res.json());
    return response;

  }

}
