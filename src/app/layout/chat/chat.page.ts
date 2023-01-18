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
  socketServerUrl: string;
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
    this.socketServerUrl = 'ws://shroom-share.onrender.com/';
    this.socket = new WebSocket(
      `${this.socketServerUrl}?language=${this.language}&id=${this.currentUserId}`
    );
  }

  ngOnInit() {
    this.initChat();
  }

  onSubmit(form: NgForm) {
    console.log('submit message');
    const ok = this.updateCurrentUser();
    if (ok) {
      this.sendMessage(this.lastMessage.value);
      this.lastMessage.value = '';
    }
  }

  onLanguageChange(form: NgForm) {
    console.log(`change language for: ${this.language}`);
    const ok = this.updateCurrentUser();
    if (ok) {
      this.socket = new WebSocket(
        `${this.socketServerUrl}?language=${this.language}&id=${this.currentUserId}`
      );
      this.initChat();
      this.messages = [];
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
    this.socket.addEventListener('open', (event) => {});
    // Ecoute des nouveaux messages du serveur
    this.socket.addEventListener('message', (event) => {
      console.log('Voici un message du serveur', event.data);
      this.handleServerMessage(JSON.parse(event.data));
    });
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  handleServerMessage(message: webSocketResponse) {
    console.log('message from server recieved to handle', message);
    if (message.message !== undefined) {
      const newMessage = {
        value: message.message,
        timestamp: message.timestamp,
        username: message.user.username,
        userId: message.user.id,
      };
      this.messages.push(newMessage);
    }
  }
}
