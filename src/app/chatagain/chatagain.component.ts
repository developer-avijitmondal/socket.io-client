import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketioService } from '../services/socketio.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  deviceInfo;

  constructor(private socketService: SocketioService,private _userService:UserService,
    private deviceService: DeviceDetectorService) {
    if(this._userService.isLoggedIn()){
      this.userEmail=localStorage.getItem('loggedUserName');
    }
    console.log(this.userEmail);
    this.socketService.joinStaticRoom(this.userEmail);
    this.epicFunction();

  }

  sendMessage() {
    this.socketService.sendMessage(this.model);
    this.myForm.resetForm();
    //this.message = '';
  }

  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
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
