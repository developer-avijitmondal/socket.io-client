import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _userService:UserService,private router : Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this._userService.oneUserLoggedOut().subscribe(res=>{
      console.log(res);
    },error=>{
      console.log(error);
    });
    this._userService.deleteToken();
    this.router.navigate(['/']);
  }

}
