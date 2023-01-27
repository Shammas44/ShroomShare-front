import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../models/message';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { webSocketResponse } from 'src/app/models/webSocketResponse';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements ViewDidEnter {
  lastMessage: Message;
  messages: Message[];
  language: string;
  currentUserId: string;
  currentUserName: string;
  socketServerUrl: string;
  socket?: WebSocket;

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
    this.socketServerUrl = environment.webcocketUrl;
  }

  ionViewDidEnter(): void {
    this.socket = this.createBaseWebSocket();
    //For unknown reason, the first webSocket created does not recieve messages, so two are created in a row to fix it.
    this.socket = this.createBaseWebSocket();
    // TODO: display popup if socket === undefined
  }

  scrollToBottomChat() {
    const chatMessagesDiv = document.querySelector('.chat-messages-div');
    if (chatMessagesDiv !== null) {
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
  }

  onLanguageChange(form: NgForm) {
    console.log(`change language for: ${this.language}`);
    const ok = this.updateCurrentUser();
    if (ok) {
      this.socket = this.createBaseWebSocket();
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
      //Défilement automatique avec délais des derniers messages
      setTimeout(() => {
        this.scrollToBottomChat();
      }, 250);
    }
  }

  createBaseWebSocket(): WebSocket | undefined {
    try {
      const socket = new WebSocket(
        `${this.socketServerUrl}?language=${this.language}&id=${this.currentUserId}`
      ); // Ouverture de la connexion
      socket.addEventListener('open', (event) => {});
      // Ecoute des nouveaux messages du serveur
      socket.addEventListener('message', (event) => {
        console.log('Voici un message du serveur', event.data);
        this.handleServerMessage(JSON.parse(event.data));
      });
      return socket;
    } catch (error) {
      return undefined;
    }
  }

  async onSubmit(form: NgForm) {
    console.log('submit message');
    const ok = this.updateCurrentUser();
    if (ok && this.socket) {
      if (
        this.socket.readyState == WebSocket.CLOSED ||
        this.socket.readyState == WebSocket.CLOSING
      ) {
        this.socket = this.createBaseWebSocket();
      }
      await this.waitForOpenConnection();
      this.sendMessage(this.lastMessage.value);
      this.lastMessage.value = '';
    }
  }

  sendMessage(message: string) {
    this.socket?.send(message);
  }

  waitForOpenConnection() {
    return new Promise<void>((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200; //ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error('Maximum number of attempts exceeded'));
        } else if (this.socket?.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  }
}
