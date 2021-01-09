import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatBadgeModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './Services/user.service';
import { MessageService } from './Services/message.service';
import {ToastrModule} from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatBadgeModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
