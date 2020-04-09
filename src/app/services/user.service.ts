import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }   

  constructor(private http: HttpClient,private _router:Router) { }

  authUser(employee): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + 'login', JSON.stringify(employee), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  getUserProfile(): Observable<any> { //on this API url we are passwing jwt token with interceptor
    return this.http.get<any>(environment.apiUserBaseUrl + 'userProfile')
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  oneUserLoggedIn(): Observable<any> { //on this API url we are passwing jwt token with interceptor
    return this.http.get<any>(environment.apiUserBaseUrl + 'oneUserLoggedIn')
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  oneUserLoggedOut(): Observable<any> { //on this API url we are passwing jwt token with interceptor
    return this.http.get<any>(environment.apiUserBaseUrl + 'oneUserLoggedOut')
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getLoggedUsers(): Observable<any> { //on this API url we are passwing jwt token with interceptor
    return this.http.get<any>(environment.apiUserBaseUrl + 'getLoggedUsers')
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createChatRoom(data): Observable<any> {
    return this.http.post<any>(environment.apiUserBaseUrl + 'createChatRoom', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  checkRoomConnections(data): Observable<any> {
    return this.http.post<any>(environment.apiUserBaseUrl + 'checkRoomConnections', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  updateRoomConnections(data): Observable<any> {
    return this.http.post<any>(environment.apiUserBaseUrl + 'updateRoomConnections', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // public getRoomMessages = () => {
  //   return Observable.create((observer) => {  //console.log(observer);
  //       this.socket.on('get-room-message', (roomMessage) => {  console.log(roomMessage);
  //         observer.next(roomMessage);
  //       });
  //       this.http.get<any>(environment.apiUserBaseUrl + 'getLoggedUsers')
  //       .pipe(
  //         retry(1),
  //           catchError(this.handleError)
            
  //       )
  //   });
  // }
  
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUserName');
    localStorage.removeItem('loggedId');
    localStorage.clear();
  }

  getUserPayload() {
    var token = this.getToken();
    //console.log(token);
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      //console.log(userPayload);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  // Error handling 
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        if(error.status==422){ //validate status server
          errorMessage=error;
        }else{
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

    }
    //console.log(error);
    return throwError(errorMessage);
  }
}
