import { Injectable, Inject } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable, Observer,  throwError, from } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  ObservableData;
  staticRoomNumber;

  mediaConstraints: any = {
    audio: true,
    video: { width: 1280, height: 720 },
  };
  localStream: any;
  remoteStream: any;
  isRoomCreator: any;
  rtcPeerConnection: any; // Connection between the local device and the remote peer.
  roomId: any;

  videoChatContainer: any;
  localVideoComponent: any;
  remoteVideoComponent: any;

  // Free public STUN servers provided by Google.
  iceServers: any = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient,private _router:Router,
              @Inject(DOCUMENT) document) {
    const unqNumber=uuidv4();
    this.socket = io(environment.SOCKET_ENDPOINT);
    // this.socket.emit('join', {  email: unqNumber  });
    console.log(unqNumber);
    this.staticRoomNumber='web';
    this.localVideoComponent = document.getElementById('local-video');
  }

  // setupSocketConnection() {
  //   this.socket = io(environment.SOCKET_ENDPOINT);
  //   // this.socket.emit('my message', 'Hello there from Angular.');

  //   // this.socket.on('my broadcast', (data: string) => {
  //   //   console.log(data);
  //   // });
  // }

  async setLocalStream(mediaConstraints) {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (error) {
      console.error('Could not get user media', error);
    }

    this.localStream = stream;
    this.localVideoComponent.srcObject = stream;
  }

  public joinVideoRoom(room: any) {
    if (room === '') {
      alert('Please type a room ID');
    } else {
      this.roomId = room;
      this.socket.emit('join', room);
      // this.showVideoConference();
    }
  }

  public joinRoom(room){ //console.log(userEmail);
    this.socket.emit('join', room);
    //this.socket.emit('join', this.staticRoomNumber);
  }

  public joinStaticRoom(room){ //console.log(userEmail);
    //this.socket.emit('join', room);
    this.socket.emit('join', this.staticRoomNumber);
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
