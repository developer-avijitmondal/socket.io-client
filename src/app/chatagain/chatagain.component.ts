import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketioService } from '../services/socketio.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chatagain',
  templateUrl: './chatagain.component.html',
  styleUrls: ['./chatagain.component.css']
})
export class ChatagainComponent implements OnInit {

  @ViewChild('f', { static: true })myForm: NgForm;
  model: any = {};
  message: string;
  messages: string[] = [];
  userEmail;

  constructor(private socketService: SocketioService,private _userService:UserService) { 
    if(this._userService.isLoggedIn()){
      this.userEmail=localStorage.getItem('loggedUserName');
    }
    //console.log(this.userEmail);
    this.socketService.joinRoom(this.userEmail);

  }

  sendMessage() {
    this.socketService.sendMessage(this.model);
    this.myForm.resetForm();
    //this.message = '';
  }

  ngOnInit() {
    //this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
        //console.log(this.messages);
      });
  }

}
