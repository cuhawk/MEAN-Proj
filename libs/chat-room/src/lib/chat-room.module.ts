import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateChatComponent } from "./create-chat/create-chat.component";
import { JoinChatComponent } from "./join-chat/join-chat.component";
import { NgIconComponent } from "@ng-icons/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbAlertModule, NgbToast, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

/**
 *  Angular Component
 */
const MODULES = [
  CommonModule,
];

/**
 *  Main and CustomComponent,
 */
const COMPONENT = [
  CreateChatComponent,
  JoinChatComponent
];


@NgModule({
  imports: [
    ...MODULES,
    NgIconComponent,
    ReactiveFormsModule,
    NgbToast
  ],
  declarations: COMPONENT,
  exports: COMPONENT,
})
export class ChatRoomModule {}
