import { Injectable } from '@angular/core';
import { Chat} from '../Models/chat';
import { SingleMessage } from '../Models/single-message';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  currentUser:User=new User();
  chats:Chat[]=new Array<Chat>();

  constructor() { }

  setUser(user:User){
    this.currentUser=user;
  }

  getUser(){
    return this.currentUser;
  }

  getMessagesForUser(){
    let index=this.chats.findIndex(x=>x.userid==this.currentUser.id);
    if(index!=-1){
      return this.chats[index];
    }
    else{
      let newRecord=new Chat();
      newRecord.userid=this.currentUser.id;
      newRecord.messages=new Array<SingleMessage>();
      this.chats.push(newRecord);
      return newRecord;
    }
  }

  addMessageForUser(userid:string,fromid:string,message:string){
    let index=this.chats.findIndex(x=>x.userid==userid);
    if(index===-1){
      let newRecord=new Chat();
      newRecord.userid=userid;
      newRecord.messages=new Array<SingleMessage>();
      this.chats.push(newRecord);
      index=this.chats.findIndex(x=>x.userid==userid);
    }
    var singleMessage=new SingleMessage();
    singleMessage.content=message;
    singleMessage.userid=fromid;
    this.chats[index].messages.push(singleMessage);
  }
}
