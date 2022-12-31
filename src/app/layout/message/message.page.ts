import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../models/message';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  lastMessage: Message;
  messages: Message[];

  constructor(private auth: AuthService) {
    // appeler authservice à la place
    this.lastMessage = {
      value: '',
      timestamp: 0,
      username: '',
      userId: 0,
    };
    this.messages = [];
  }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log('submit message');
    this.lastMessage.timestamp = Date.now();
    this.auth.getUser$().subscribe((res) => {
      if (res != undefined) {
        this.lastMessage.username = res.username;
        this.lastMessage.userId = Number(res.id);
        console.log(this.lastMessage);
      }
    });
  }
}
