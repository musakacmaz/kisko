import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = 'http://37.148.211.39/kisko/api/user/logout';

@Injectable()
export class LogOutProvider {

  constructor(public http: Http) {
    console.log('Hello LogoutProvider ');
  }

  logout(credentials){

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let response = this.http.post(apiUrl, credentials, {headers: headers}).map(res => res.json());
    return response;

  }

}
