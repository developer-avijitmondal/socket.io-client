import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../services/user.service';
import { RegisterService } from '../services/register.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  serverErrorMessages: string;
  userDetails;
  serverValidateError;

  constructor(private router : Router,private _regService:RegisterService,
    private _userService:UserService,private flashMessage: FlashMessagesService) { }

  onSubmit() {
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
    this._userService.authUser(this.model).subscribe(res =>{ //console.log(res);
      //if login success
      this._userService.setToken(res.result);
      //get data
      this._userService.getUserProfile().subscribe(
        res => { //console.log(res['result']);
          this.userDetails = res['result'];
          //console.log(this.userDetails.name);
          //this.name=this.userDetails.name;
          localStorage.setItem('loggedUserName', this.userDetails.email);
          localStorage.setItem('loggedId', this.userDetails.id);
          this._userService.oneUserLoggedIn().subscribe(res=>{
            console.log(res);
          },error=>{
            console.log(error);
          });
               

          //this.myOutput.emit(this.name);
        },
        err => { 
          console.log(err);
          
        }
      );
      this.router.navigateByUrl('/dashboard');
    },error=>{
      //if invalid user
      this.flashMessage.show(error.error.result,{ cssClass: 'alert-'+error.error.type, timeout: 2000 });
      console.log(error);
    });
  }

  ngOnInit() {
    if(this._userService.isLoggedIn())
    this.router.navigateByUrl('/dashboard');
  }

}
