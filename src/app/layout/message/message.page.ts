import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../models/message';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  lastMessage: Message;
  messages: Message[];

  constructor() {
    this.lastMessage = {
      value: '',
      timestamp: 0,
      username: '',
      userId: 0
    };
    this.messages = [];
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log("submit")
    // this.lastMessage.timestamp = Date.now();
    // storage.get('auth').then((storedAuth) => {
    //   this.lastMessage.username = storedAuth.user.username;
    //   this.lastMessage.userId = storedAuth.user.id;
    //   console.log("last message", this.lastMessage);
    // });
  }

}
