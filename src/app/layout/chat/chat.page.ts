import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../models/message';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/auth/auth.service';
import { NumberSymbol } from '@angular/common';
import { MessagePageModule } from './chat.module';
import { userInfo } from 'os';
import { webSocketResponse } from 'src/app/models/webSocketResponse';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  lastMessage: Message;
  messages: Message[];
  language: string;
  currentUserId: string;
  currentUserName: string;
  socket: WebSocket;

  constructor(private auth: AuthService) {
    // appeler authservice à la place
    this.lastMessage = {
      value: '',
      timestamp: 0,
      username: '',
      userId: '',
    };
    this.messages = [];
    this.language = 'fr';
    this.currentUserId = this.getBaseUserId();
    this.currentUserName = 'base string';
    this.socket = new WebSocket(
      `ws://127.0.0.1:3000/?language=${this.language}&id=${this.currentUserId}`
    );
  }

  ngOnInit() {
    this.initChat();
  }

  onSubmit(form: NgForm) {
    console.log('submit message');

    //this.lastMessage.timestamp = Date.now();
    const ok = this.updateCurrentUser();
    if (ok) {
      // const lastMessageToStore = {
      //   value: this.lastMessage.value,
      //   timestamp: this.lastMessage.timestamp,
      //   username: this.currentUserName,
      //   userId: this.currentUserName,
      // };
      // this.messages.push(lastMessageToStore);

      // this.lastMessage.value = '';
      this.sendMessage(this.lastMessage.value);
    }
    //Appeler le service addMessage
  }

  onLanguageChange(form: NgForm) {
    console.log('change language');
    const ok = this.updateCurrentUser();
    if (ok) {
      this.socket = new WebSocket(
        `ws://127.0.0.1:3000/?language=${this.language}&id=${this.currentUserId}`
      );
    }
  }

  updateCurrentUser(): boolean {
    let userOk = false;
    this.auth.getUser$().subscribe((res) => {
      if (res !== undefined) {
        this.currentUserName = res.username;
        this.currentUserId = res.id;
        userOk = true;
      }
    });
    return userOk;
  }

  getBaseUserId(): string {
    let id = 'unfound';
    this.auth.getUser$().subscribe((res) => {
      if (res !== undefined) {
        id = res.id;
      }
    });
    return id;
  }

  initChat() {
    // Ouverture de la connexion
    this.socket.addEventListener('open', (event) => {
      this.sendMessage('Opening of connexion');
    });
    // Ecoute des nouveaux messages du serveur
    this.socket.addEventListener('message', (event) => {
      console.log('Voici un message du serveur', event.data);
      this.handleServerMessage(event.data);
    });
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  handleServerMessage(message: webSocketResponse) {
    const newMessage = {
      value: message.message,
      timestamp: message.timestamp,
      username: message.user.username,
      userId: message.user.id,
    };
    this.messages.push(newMessage);
  }
}
