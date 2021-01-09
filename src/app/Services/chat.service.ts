import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { Message } from '../Models/message';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket;
  constructor(){
   this.socket = io('http://localhost:3000');
  }

  joinRoom(data)
  {
      this.socket.emit('join', data);
  }
  newUserJoined():Observable<User>
  {
    return new Observable((observer) => {
      this.socket.on('user-joined', (user) => {
        observer.next(user);
      });
  });

  }

  leaveRoom(data){
    this.socket.emit('leave',data);
}

userLeftRoom():Observable<User>{
  return new Observable((observer) => {
    this.socket.on('user-left', (user) => {
      observer.next(user);
    });
});
}

sendMessage(data)
{
    this.socket.emit('message',data);
}

public getMessages():Observable<Message> {
  return new Observable((observer) => {
      this.socket.on('new-message', (messageData) => {
        observer.next(messageData);
      });
  });
}

}
