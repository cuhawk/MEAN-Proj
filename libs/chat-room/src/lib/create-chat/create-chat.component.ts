import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CreateChatService } from "./create-chat.service";
import { createChat } from "../../../../abstract/type/createChat.type";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'cuhawk-mean-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss'],
})
export class CreateChatComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public response$: Subscription;
  public isLoading: boolean;
  public errorMessage: string | undefined;
  public successMessage: string | undefined;

  constructor(public fb: FormBuilder, public service: CreateChatService, public router: Router) {
    this.createForm = this.fb.group({
      nickname: new FormControl<string>('Renaud', [Validators.minLength(2), Validators.required]),
      room: new FormControl<string>('', [])
    });
    this.isLoading = false;
    this.response$ = new Subscription();
  }

  ngOnDestroy(): void {
    this.response$?.unsubscribe();
  }


  ngOnInit(): void {
    console.log(this.createForm.controls['nickname'].value);
  }

  public createChat() {
    this.isLoading = true;
    this.successMessage = undefined;
    this.errorMessage = undefined;
    this.response$ = this.service.createRoom().subscribe(
      {
        next: (data: createChat): void => {
          this.successMessage = data?.message;
          this.router.navigate([`join/${data?.uuid}`], {
            state: {
              uuid: data.uuid,
              nickname: this.createForm.controls['nickname'].value,
            }
          });
        },
        error: (err): void => this.errorMessage = err?.message,
        complete: (): boolean => this.isLoading = false
      }
  )
  }
}
