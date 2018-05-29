import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import "rxjs/add/operator/map";

let apiUrl = "http://kisko.net/apiv2/ozgecmis.php";

@Injectable()
export class OzgecmisProvider {

  constructor(public http: Http) {
  }

  ozgecmis(credentials) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let response = this.http
      .post(apiUrl, credentials, { headers: headers })
      .map(res => res.json());
    return response;
  }

}
