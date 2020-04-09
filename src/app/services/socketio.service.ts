import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable, Observer,  throwError, from } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  ObservableData;
  staticRoomNumber;
  
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }   

  constructor(private http: HttpClient,private _router:Router) { 
    const unqNumber=uuidv4();
    this.socket = io(environment.SOCKET_ENDPOINT);
    // this.socket.emit('join', {  email: unqNumber  });
    console.log(unqNumber);
    this.staticRoomNumber='web';
  }

  // setupSocketConnection() {
  //   this.socket = io(environment.SOCKET_ENDPOINT);
  //   // this.socket.emit('my message', 'Hello there from Angular.');

  //   // this.socket.on('my broadcast', (data: string) => {
  //   //   console.log(data);
  //   // });
  // }

  public joinRoom(room){ //console.log(userEmail);
    this.socket.emit('join', room);
    //this.socket.emit('join', this.staticRoomNumber);
  }

  public checkUserJoinedOnRoom(){
    return Observable.create((observer) => {  
      this.socket.on('user-joined', (roomStatus) => {  
        observer.next(roomStatus);
      });
    });
    // this.socket.on('user-joined', (roomStatus) => {  
    //   return roomStatus;console.log(roomStatus);
    // });
  }

  public leaveRoom(room){ //console.log(userEmail);
    this.socket.emit('leave', room);
    //this.socket.emit('join', this.staticRoomNumber);
  }

  public sendRoomMessage(message){
    this.socket.emit('send-message', message);
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
    // this.socket.on('get-message',message);
  }

  public getOnlineUsers(){
    return Observable.create((observer) => {  
      this.socket.on('get-online-users', (onLineUsers) => {  
        //console.log(onLineUsers);
        observer.next(onLineUsers);
      });
    });
  }

  public getMessages = () => {
    return Observable.create((observer) => {  //console.log(observer);
        this.socket.on('get-message', (message) => {  //console.log(message);
            observer.next(message);
        });
    });
  }

  public getRoomMessages = () => {
    return Observable.create((observer) => {  //console.log(observer);
        this.socket.on('get-room-message', (roomMessage) => {  console.log(roomMessage);
          observer.next(roomMessage);
        });
    });
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
