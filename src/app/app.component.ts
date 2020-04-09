import { Component, OnInit } from '@angular/core';
import { UserService } from '../app/services/user.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';
import { SocketioService } from '../app/services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'client';
  onLineLoggedUser;

  constructor(private _userService:UserService,private router : Router,
    private flashMessage: FlashMessagesService,private socketService: SocketioService) { }

  ngOnInit() {
    if(this._userService.isLoggedIn()){
      this.socketService.getOnlineUsers().subscribe((onLineList: string) => {
        //console.log(onLineList);
        this.onLineLoggedUser=onLineList;
        //console.log(this.messages);
      });
    }
  }

}
