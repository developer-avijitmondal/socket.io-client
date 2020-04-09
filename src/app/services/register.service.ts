import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }    
  constructor(private http: HttpClient,private _router:Router) { }

  regsterUser(data): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + 'register-user', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
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
