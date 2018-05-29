import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = 'http://kisko.net/apiv2/relation_get.php';

@Injectable()
export class GetUserRelationUserProvider {

  constructor(public http: Http) {
    console.log('Hello getUser Provider');
  }

  getUser(credentials){
   let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let response = this.http.post(apiUrl, credentials, {headers: headers}).map(res => res.json());
    return response;
  }

}
