import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { createChat } from "../../../../abstract/type/createChat.type";

@Injectable({
  providedIn: 'root'
})
export class CreateChatService {
  constructor(
    private http: HttpClient
  ) { }

  public createRoom(): Observable<createChat> {
    return this.http.get<createChat>('http://localhost:3000/api/chat/create');
  }
}
