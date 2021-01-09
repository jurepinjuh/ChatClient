import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient){}
  user:User;
  setUser(user:User){
    this.user=user;
  }

  getUser(){
    return this.user;
  }

  getOnlineUsers():Observable<User[]>{
   return this.http.get<any>('http://localhost:3000/onlineUsers');
  }

}
