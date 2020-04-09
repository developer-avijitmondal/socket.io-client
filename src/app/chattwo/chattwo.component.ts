import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-chattwo',
  templateUrl: './chattwo.component.html',
  styleUrls: ['./chattwo.component.css']
})
export class ChattwoComponent implements OnInit {

  newMessage: string;
  messageList:  string[] = [];

  constructor(private chatService: ChatService) { }

  sendMessage() {
    console.log(this.newMessage);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
      });
  }

}
