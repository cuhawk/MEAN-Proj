import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { JoinChatService } from "./join-chat.service";
import { RESPONSE_MESSAGE, typeResponseMessage } from "../../../../constant/response.constant";
import { ChatRoom } from "../../../../abstract/class/ChatRoom";
import { WebSocketChatResponse } from "../../../../abstract";

// for
type MessagesType = WebSocketChatResponse & { type: string };

@Component({
  selector: "cuhawk-mean-join-chat",
  templateUrl: "./join-chat.component.html",
  styleUrls: ["./join-chat.component.scss"]
})
export class JoinChatComponent implements OnDestroy, OnInit {

  public errorMessage: string | typeResponseMessage | undefined;
  public uuidValid: boolean | undefined;
  public routeState: Partial<ChatRoom> | undefined;
  public chatForm: FormGroup;
  public messages: Array<WebSocketChatResponse & { type: string }>;

  public subscriptions: Array<Subscription>;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private service: JoinChatService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.subscriptions = new Array<Subscription>();
    this.routeState = this.router.getCurrentNavigation()?.extras.state;

    this.setStates();

    this.chatForm = this.fb.group({
      nickname: new FormControl<string | undefined>(this.routeState?.nickname, {
        validators: [Validators.minLength(2), Validators.required],
        nonNullable: true
      }),
      message: new FormControl<string | undefined>("", [Validators.minLength(1), Validators.required])
    });

    this.messages = new Array<MessagesType>({
      time: Date.now(),
      sender: "General chat",
      message: "Welcome to the chat room!",
      type: "general"
    });
  }

  ngOnInit(): void {
    if (this.routeState?.nickname && this.routeState.nickname !== "") {
      this.uuidValidate();
      this.service.joinRoom({
        sender: this.chatForm.controls["nickname"].value, room: this.route.snapshot.params["uuid"]
      });
    }

    this.getSubscriptions();
  }

  @HostListener("window:beforeunload")
  private exitingChatRoom() {
    this.service.leaveRoom({
      sender: this.chatForm.controls["nickname"].value, room: this.route.snapshot.params["uuid"]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public copyUUID(): void {
    this.purgeMessage();
    this.subscriptions.push(this.route.params.subscribe({
      next: (params: Params) => this.copyClipboard(params["uuid"]),
      error: err => this.errorMessage = err.errorMessage ?? err
    }));
  }

  public copyLink(): void {
    this.purgeMessage();
    this.copyClipboard(window.document.URL);
  }

  public parseMessage(value: string): string {
    const VALUE: typeResponseMessage = value as typeResponseMessage;
    return RESPONSE_MESSAGE[VALUE] ?? value;
  }

  public submitNickname(): void {
    const UUID = this.route.snapshot.params["uuid"];
    this.router.navigate([`join/${UUID}`], {
      state: {
        nickname: this.chatForm.controls["nickname"].value, uuid: this.route.snapshot.params["uuid"]
      }
    });
  }

  public submitMessage(): void {
    const { nickname, message } = this.chatForm.getRawValue();
    this.service.sendMessage({ room: this.route.snapshot.params["uuid"], sender: nickname, message });
    this.chatForm.patchValue({ message: "" });
  }

  private getSubscriptions(): void {

    this.subscriptions.push(this.service.getUserJoin().subscribe({
      next: (data: WebSocketChatResponse) => this.messages.push({ ...data, type: "info" }),
      error: (err) => this.messages.push({ time: Date.now(), sender: "", message: err?.message, type: "error" })
    }));

    this.subscriptions.push(this.service.getNewMessages().subscribe({
      next: (data: WebSocketChatResponse) => this.messages.push({ ...data, type: "message" }),
      error: (err) => this.messages.push({ time: Date.now(), sender: "", message: err?.message, type: "error" })
    }));

    this.subscriptions.push(this.service.getUserLeaved().subscribe({
      next: (data: WebSocketChatResponse) => this.messages.push({ ...data, type: "info" }),
      error: (err) => this.messages.push({ time: Date.now(), sender: "", message: err?.message, type: "error" })
    }));
  }

  private copyClipboard(value: string): Promise<void> {
    return navigator.clipboard.writeText(value);
  }

  private purgeMessage(): void {
    this.errorMessage = undefined;
  }

  private setStates(): void {
    if (!this.routeState) {
      this.subscriptions.push(this.route?.params.subscribe((data: Params) => this.routeState = {
        id: 0,
        roomId: data["uuid"]
      }));
    }
  }

  private uuidValidate(): void {
    this.purgeMessage();
    this.subscriptions.push(this.service.joinChat(this.route.snapshot.params["uuid"])
      .subscribe({
        next: (value: { message: string }): void => {
          if (value.message === "CHAT_ROOM_EXISTS") {
            this.uuidValid = true;
          }
        }, error: (): void => {
          this.uuidValid = false;
          this.errorMessage = "CHAT_ROOM_DONT_EXISTS";
        }
      }));
  }
}

