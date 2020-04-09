import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketioService } from '../services/socketio.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-usertouserchat',
  templateUrl: './usertouserchat.component.html',
  styleUrls: ['./usertouserchat.component.css']
})
export class UsertouserchatComponent implements OnInit {

  @ViewChild('f', { static: true })myForm: NgForm;
  model: any = {};
  message: string;
  messages: string[] = [];
  userEmail;

  constructor(private socketService: SocketioService,private _userService:UserService) { 
    if(this._userService.isLoggedIn()){
      this.userEmail=localStorage.getItem('loggedUserName');
    }
    console.log(this.userEmail);
    this.socketService.joinRoom(this.userEmail);
  }

  sendMessage() {
    let userMessage={
      message:this.model.message,
      user:this.userEmail
    };
    this.socketService.sendRoomMessage(userMessage);
    this.myForm.resetForm();
    //this.message = '';
  }

  ngOnInit() {
    this.socketService
    .getRoomMessages()
    .subscribe((message: string) => {
      this.messages.push(message);
      //console.log(this.messages);
    });
  }

}
