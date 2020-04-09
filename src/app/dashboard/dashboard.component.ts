import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userDetails;
  name;
  username;

  constructor(private _userService:UserService,private router : Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    if(localStorage.getItem('loggedUserName')==undefined){
      this._userService.getUserProfile().subscribe(
        res => { //console.log(res['result']);
          this.userDetails = res['result'];
          //console.log(this.userDetails.name);
          this.name=this.userDetails.email;
          //this.myOutput.emit(this.name);
        },
        err => { 
          console.log(err);
          
        }
      );
    }else{
      this.name=localStorage.getItem('loggedUserName');
    }
    //test

  }

}
