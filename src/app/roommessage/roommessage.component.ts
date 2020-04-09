import { Component, OnInit, ViewChild,  Renderer } from '@angular/core';
import { SocketioService } from '../services/socketio.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-roommessage',
  templateUrl: './roommessage.component.html',
  styleUrls: ['./roommessage.component.css']
})
export class RoommessageComponent implements OnInit {

  @ViewChild('f', { static: true })myForm: NgForm;
  model: any = {};
  message: string;
  messages: string[] = [];
  connectedUsers: string[] = [];
  userEmail;
  loggedUser;
  showLoggedUser = [];
  connections = [];
  getRoomName;
  prevRoom;
  currRoom;
  enableRoom=false;
  oldConnection;
  roomConId;
  serverRoomStatus:any;
  data$: Observable<string>;
  disableClick=false;
  disableWith;
  selectedIndex: number = null;

  
  constructor(private socketService: SocketioService,private _userService:UserService,
    ) { 
    if(this._userService.isLoggedIn()){
      this.userEmail=localStorage.getItem('loggedUserName');
      console.log(localStorage.getItem('loggedId'));
    }
    //console.log(this.userEmail);
    //this.socketService.joinRoom(this.userEmail);
  }

  sendMessage() { //console.log('clicked');
    // this.myForm.resetForm();
    let userMessage={
      message:this.model.message,
      user:this.userEmail,
      room:this.getRoomName
    };
    this.socketService.sendRoomMessage(userMessage);
    
  }

  ngOnInit() {
    //this.socketService.setupSocketConnection();
    this._userService.getLoggedUsers().subscribe(res=>{
      this.loggedUser=res.result;
        console.log(this.loggedUser);
        for(var index in this.loggedUser)
        { 
          console.log(this.loggedUser[index].User.email); 
          if(this.loggedUser[index].User.email!=localStorage.getItem('loggedUserName')){
            this.showLoggedUser.push({email:this.loggedUser[index].User.email,id:this.loggedUser[index].User.id});
          } 

        } console.log(this.showLoggedUser);

      },error=>{
        console.log(error);
        
      });

      this.socketService
      .getRoomMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
        console.log(this.messages);
      });
 
  }


  chatWith(data,index: number){
    //this.disableClick=true;
    //this.disableWith=data;
    this.selectedIndex = index;
    let users={
      withUser:data
    };
    this._userService.createChatRoom(users).subscribe(res=>{
      console.log(res);
      console.log(res['result'][0].roomname);

      if(res['result'][0].roomname){
        this.enableRoom=true;
      }else{
        this.enableRoom=false;
      }
      this.getRoomName=res['result'][0].roomname;
      //localStorage.setItem('loggedId', this.getRoomName);
      let totalData={
        room:this.getRoomName,
        withUser:data
      };

      this.socketService.joinRoom(totalData);
      
      this.socketService
      .checkUserJoinedOnRoom()
        .subscribe((roomStatus: string) => {
          console.log(roomStatus);
          console.log(roomStatus['room']);

          console.log('withUser '+roomStatus['withUser']);
          // let serverRoomStatus:any=roomStatus['room']; 
          this.serverRoomStatus=roomStatus['room'];  
          console.log(this.serverRoomStatus.length);

          let checkRoomConnection={
            room_id:res['result'][0].id,
            withUser:data,
            connection:this.serverRoomStatus
          };

          this._userService.checkRoomConnections(checkRoomConnection).subscribe(res=>{
            console.log(res);
            //console.log(res.result.connection);
          },err=>{

          });

          // sessionStorage.removeItem('connections');
          // sessionStorage.setItem('connections', JSON.stringify(this.serverRoomStatus));

          // if(localStorage.getItem('connections')==null){
          //   localStorage.setItem('connections', JSON.stringify(this.serverRoomStatus));
          // }else{
          //   localStorage.removeItem('connections');
          //   localStorage.setItem('connections', JSON.stringify(this.serverRoomStatus));
          // }

          //localStorage.removeItem('connections');
          
          


          // localStorage.setItem('connections', JSON.stringify(this.connections));
          //console.log(localStorage.getItem('connections'));

          // if(localStorage.getItem('connections')==null){
          //   console.log('session is null');
          //   if(roomStatus['withUser']==data){
          //     for (let key in serverRoomStatus) {
          //         //console.log ('key: ' +  key + ',  value: ' + roomStatus[0][key]);
          //         this.connections.push({key:key,value:key,withUser:roomStatus['withUser']});
          //     }
          //     console.log(this.connections);
          //   }
          // }else{
          //   console.log('got session data');
          //   let getConnections=JSON.parse(localStorage.getItem('connections'));
          //   console.log(getConnections); 
          //   console.log('end got session data');
          //   if(roomStatus['withUser']==data){
          //     for (let key in serverRoomStatus) {
          //         //console.log ('key: ' +  key + ',  value: ' + roomStatus[0][key]);
          //         this.connections.push({key:key,value:key,withUser:roomStatus['withUser']});
          //     }
          //     console.log(this.connections);
          //   }
          // }

          // if(localStorage.getItem('connections')==null){
          //   localStorage.setItem('connections', JSON.stringify(this.connections));//set session
          // }

          //let getConnections=JSON.parse(localStorage.getItem('connections'));
          
          // for(let key in getConnections){
          //   console.log('key');
          //   console.log(getConnections[key]['withUser']);
          //   if(getConnections[key]['withUser']==data){
          //     let serverRoomStatus2:any=roomStatus['room'];
          //     for (let key in serverRoomStatus2) {
          //       //console.log ('key: ' +  key + ',  value: ' + roomStatus[0][key]);
          //       this.connections.push({key:key,value:key,withUser:roomStatus['withUser']});
          //     }
          //   }
          //   localStorage.removeItem('connections');
          //   //update session
            
          //   console.log('end key');
          // }

          //localStorage.setItem('connections', JSON.stringify(this.connections));

          //console.log(getConnections);
          
          //console.log(localStorage.getItem('connections'));
          // let serverRoomStatus:any=roomStatus;
          // for (let key in serverRoomStatus) {
          //     console.log ('key: ' +  key + ',  value: ' + roomStatus[key]);
          //     this.connections.push({key:key,value:roomStatus[key],withUser:data});
          // }
          
          
      });

      //let getConnections=sessionStorage.getItem('connections');

      
      // let checkRoomConnection={
      //   room_id:res['result'][0].id,
      //   withUser:data,
      //   connection:getConnections
      // };
      
   
     
      // console.log('checkRoomConnection');
      // console.log(checkRoomConnection);
      // console.log('end checkRoomConnection');

      // this._userService.checkRoomConnections(checkRoomConnection).subscribe(res=>{
      //   console.log(res);
      //   console.log(res.result.connection);
      //   this.roomConId=res.result.id;
      //   this.oldConnection=JSON.parse(res.result.connection);
      //   // if(JSON.parse(res.result.connection)!=serverRoomStatus){
      //   //   console.log('not same');  //console.log(res.result.id);
      //   //   let updateRoomCon:any={
      //   //     RoomCon_id:roomConId,
      //   //     connection:serverRoomStatus,
      //   //     withUser:data,
      //   //   };  
      //   //   console.log(updateRoomCon);
      //   //   this._userService.updateRoomConnections(updateRoomCon).subscribe(res=>{
      //   //     //console.log(res);
      //   //   },err=>{
      //   //     //console.log(error);
      //   //   });
      //   //   // this._userService.updateRoomConnections(updateRoomCon).subscribe(res=>{
      //   //   //   console.log(res);
      //   //   // },err=>{
      //   //   //   console.log(error);
      //   //   // });
      //   // }else{
      //   //   console.log('bot are same');
      //   // }

      //   //new code
      //   console.log('roomConId '+this.roomConId);
      //   if(this.oldConnection!=serverRoomStatus){
      //     console.log('not same');
      //       let updateRoomCon:any={
      //         RoomCon_id:this.roomConId,
      //         connection:serverRoomStatus,
      //         withUser:data,
      //       };  console.log(updateRoomCon);
      //       this._userService.updateRoomConnections(updateRoomCon).subscribe(res=>{
      //         console.log(res);
      //       },err=>{
      //         console.log(err);
      //       });
      //       console.log(res);
      //   }else{
      //     console.log('bot are same');
      //   }
      //   //new code

      // },error=>{
      //   console.log(error);
      // });

      // let checkUserJoinedOnRoom=this.socketService.checkUserJoinedOnRoom();
      // console.log(checkUserJoinedOnRoom);
    },error=>{
      console.log(error);
    });
  }

}
