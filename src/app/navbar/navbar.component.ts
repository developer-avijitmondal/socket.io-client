import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from "@angular/router";
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  onLineUsers;
  loggedInCheck=false;
  
  constructor(private _userService:UserService,private router : Router,
    private socketService: SocketioService) { }

  ngOnInit() {
    //console.log(localStorage.getItem('loggedUserName'));
    if(this._userService.isLoggedIn()){
      this.loggedInCheck=true;
    }else{
      this.loggedInCheck=false;
    }
    // this.onLineUsers=this.socketService.getOnlineUsers();

    this.socketService.getOnlineUsers().subscribe((onLineList: string) => {
      //console.log(onLineList);
      this.onLineUsers=onLineList;
      //console.log(this.messages);
    });
  }

}
