import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import {FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ChatService]
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      user:['']
    });
   }

  form;

  ngOnInit() {
  }

  Join(formValue){

    this.router.navigate(['/room', formValue.user]);
  }

}
