import { Component, OnDestroy, OnInit } from "@angular/core";
import { Path } from "../../../../abstract";
import PATHS from "../../../../constant/paths.constant";
import { catchError, Subscription } from "rxjs";
import { JoinChatService } from "../../../../chat-room/src/lib/join-chat/join-chat.service";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";


@Component({
  selector: 'cuhawk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isMenuCollapsed: boolean;
  public links: Array<Path>;
  public joinForm: FormGroup;
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(private service: JoinChatService, private fb: FormBuilder, private router: Router) {
    this.isMenuCollapsed = true;
    this.links = PATHS;
    this.joinForm = this.fb.group({
      uuid: new FormControl<string>('', [Validators.required, Validators.pattern(/[A-F 0-9]{8}-[A-F 0-9]{4}-[A-F 0-9]{4}-[A-F 0-9]{4}-[A-F 0-9]{12}/gi)])
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.joinForm.valueChanges.subscribe({
        next: (input: string) => this.service.getJoinId(input).subscribe({
          next: () => {
            const UUID: AbstractControl<string> = this.joinForm.controls["uuid"]
            if (this.joinForm.controls["uuid"].valid) {
              this.join(UUID.value);
            }
          },
        }),
        error: err => catchError(err),
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      (sub: Subscription) => sub.unsubscribe()
    );
  }

  public join(uuid: string) {
    return this.router.navigate(['join', uuid], { state: { uuid: uuid } })
  }

}
