import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = 'http://kisko.net/apiv2/relation_add.php';
let apiUrllist = 'http://kisko.net/apiv2/relation_list.php';
@Injectable()
export class RelationUserProvider {

  constructor(public http: Http) {}

  updateUser(credentials){
   let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let response = this.http.post(apiUrl, credentials, {headers: headers}).map(res => res.json());
    return response;
  }
  relationList(credentials){
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let response = this.http.post(apiUrllist, credentials, {headers: headers}).map(res => res.json());
    return response;

  }

}
