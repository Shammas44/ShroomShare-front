import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../models/message';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  lastMessage: Message;
  messages: Message[];
  language: string;

  constructor(private auth: AuthService) {
    // appeler authservice à la place
    this.lastMessage = {
      value: '',
      timestamp: 0,
      username: '',
      userId: '',
    };
    this.messages = [];
    this.language = 'french';
  }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log('submit message');
    this.lastMessage.timestamp = Date.now();
    this.auth.getUser$().subscribe((res) => {
      if (res !== undefined) {
        this.lastMessage.username = res.username;
        this.lastMessage.userId = res.id;
        console.log(this.lastMessage);
        const lastMessageToStore = {
          value: this.lastMessage.value,
          timestamp: this.lastMessage.timestamp,
          username: res.username,
          userId: res.id,
        };

        this.messages.push(lastMessageToStore);
        //console.log('tous les messages', this.messages);
        this.lastMessage.value = '';
      }
    });
  }

  onLanguageChange(form: NgForm) {
    console.log('change language');
  }
}
