import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./app.routes";

import { UiModule } from "@cuhawk-mean/ui";

import { AppComponent } from "./app.component";
import { HomeModule } from "@cuhawk-mean/home";
import { HttpClientModule } from "@angular/common/http";
import { ChatRoomModule } from "@cuhawk-mean/chat-room";

import { SocketIoModule } from 'ngx-socket-io';
import { socketIOConfig } from "../../../../libs/constant/socket.constant";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

/**
 *  Angular Modules
 */
const ANGULAR_MODULES = [
  BrowserModule,
  RouterModule.forRoot(appRoutes, { onSameUrlNavigation: "reload" }),
  HttpClientModule,
];

/**
 *  Main and Custom Module
 */
const MODULES = [
  UiModule,
  HomeModule,
  ChatRoomModule,
  SocketIoModule.forRoot(socketIOConfig),
  NgbModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...ANGULAR_MODULES,
    ...MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
