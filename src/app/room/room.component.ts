import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '../Models/chat';
import {UUID} from 'angular2-uuid';
import { UserService } from '../Services/user.service';
import { User } from '../Models/user';
import { EncryptionService } from '../Services/encryption.service';
import { MessageService } from '../Services/message.service';
import { Message } from '../Models/message';
import { Notif } from '../Models/notif';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers:[ChatService]
})
export class RoomComponent implements OnInit {

  constructor(private chatService: ChatService,
    private route: ActivatedRoute,
    private userService:UserService,
    private encService:EncryptionService,
    public messageService:MessageService,
    private toastr:ToastrService
   ) {
    this.route.paramMap.subscribe(params=>{
      this.user = params.get('user');
    });
 
   }

  guid:String;
  user: string;
  messageText: string;
  public othersMessages:Chat=new Chat();
  notifs:Notif[]=new Array<Notif>();
  users:User[]=new Array<User>();
  ngOnInit() {
    this.login();
    this.userService.getOnlineUsers().subscribe(data=>{
      this.users=data;
    },()=>{},
    ()=>{
      this.users.forEach(element => {
        if(this.userService.getUser().id!==element.id){
          this.instantiateNotif(element.id);
        }  
    });});
   this.subscribeToEvents();
  }

  ngAfterViewInit(){
    
   
  }

  sendMessage()
  {
    
    let encrypted=this.encService.encryptMessage(this.messageText,this.messageService.currentUser.key);
    this.chatService.sendMessage({"userid":this.messageService.currentUser.id,"content":encrypted,"fromUserid":this.userService.getUser().id,"signature":this.encService.createSignature(encrypted)});
    this.messageService.addMessageForUser(this.messageService.currentUser.id,this.userService.getUser().id,this.messageText);
    this.messageText='';
  }
  subscribeToEvents(){
   
    this.chatService.newUserJoined().subscribe(data=>{
      let user=new User();
      user.deserialize(data);
      if(this.users.findIndex(x=>x.id==user.id)==-1){
        this.users.push(user);
        this.instantiateNotif(user.id);
      }
    });
    
    this.chatService.userLeftRoom().subscribe(data=>{
      if(data!=null){
        let index= this.users.findIndex(x=>x.id==data.id)
        if(this.messageService.currentUser.id===data.id){
          this.messageService.setUser(new User());
        }
        this.users.splice(index,1);
        this.deleteNotifRecord(data.id);
      }
  
    })

    this.chatService.getMessages().subscribe(data=>{
      var message=new Message();
      message.deserialize(data);
      if(this.encService.verifySignature(data.signature,message.content,this.users[this.users.findIndex(x=>x.id==data.fromUserid)].key)){
        var decrypted=this.encService.decryptMessage(message.content);
        if(this.messageService.getUser().id!==data.fromUserid){
          this.toastr.warning("New message from: "+this.users[this.users.findIndex(x=>x.id==data.fromUserid)].username);
          this.addNotif(data.fromUserid);
        }
        this.messageService.addMessageForUser(data.fromUserid,data.fromUserid,decrypted);
      }
    });
  }

  login(){
    this.guid= UUID.UUID();
    let currentUser=new User()
    currentUser.username=this.user;
    currentUser.id=this.guid.toString();
    currentUser.key=btoa(this.encService.generateKeyPair());
    this.userService.setUser(currentUser)
    this.chatService.joinRoom(currentUser);
  }

  selectUser(user:User){
    this.messageService.setUser(user);
    this.setToZero(user.id);
    this.othersMessages=this.messageService.getMessagesForUser();
  }

  instantiateNotif(userid:string){
    let notif=new Notif();
    notif.numberOfNotifs=0;
    notif.userid=userid;
    this.notifs.push(notif);
  }

  addNotif(userid:string){
    this.notifs[this.getNotifIndex(userid)].numberOfNotifs++;
  }

  setToZero(userid:string){
    this.notifs[this.getNotifIndex(userid)].numberOfNotifs=0;
  }

  deleteNotifRecord(userid:string){
    this.notifs.slice(this.getNotifIndex(userid),1);
  }

 getNumberOfNotifs(userid:string){
    return this.notifs[this.getNotifIndex(userid)].numberOfNotifs;
  }

 getNotifIndex(userid:string){
    let index=this.notifs.findIndex(x=>x.userid===userid);
    return index;
  }
 
}
