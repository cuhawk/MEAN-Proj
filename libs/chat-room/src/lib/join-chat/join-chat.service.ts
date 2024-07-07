import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, tap } from "rxjs";
import { Socket } from "ngx-socket-io";
import { websocketEventKey, WS_EVENT } from "../../../../constant/websocketConfig.constant";
import { ChatPayload, WebSocketChatResponse } from "../../../../abstract";

@Injectable({
  providedIn: 'root'
})
export class JoinChatService {

  private uuid$: BehaviorSubject<string>;

  constructor(
    private http: HttpClient,
    private socket: Socket,
  ) {
    this.uuid$ = new BehaviorSubject<string>("");
  }

  /**
   *
   * @description Trigger search
   * @method
   * @return Observable<string> | void
   * @public
   */
  public getJoinId(search: string): Observable<string> {
    this.uuid$.next(search);
    return this.uuid$?.pipe(
      tap( (text: string): boolean => text.length === 2 ),
      debounceTime(800),
      distinctUntilChanged())
  }

  /**
   * Endpoint for register a room
   * @param uuid
   */
  public joinChat(uuid: string): Observable<{message: string}> {
    return this.http.get<{message: string}>(`http://localhost:3000/api/chat/join/${uuid}`);
  }

  public joinRoom(payload: Omit<ChatPayload, 'message'>): void {
    this.emit<Omit<ChatPayload, 'message'>>('join', payload);
  }

  public getUserJoin(): Observable<WebSocketChatResponse> {
    return this.receive('join');
  }

  public sendMessage(payload: { room: string, sender: string, message: string } ): void {
    this.emit('send', payload);
  }

  public getNewMessages(): Observable<WebSocketChatResponse> {
    return this.receive('send');
  }

  public leaveRoom(payload: Omit<ChatPayload, 'message'>): void {
    this.emit<Omit<ChatPayload, 'message'>>('leave', payload);
  }

  public getUserLeaved(): Observable<WebSocketChatResponse> {
    return this.receive('leave');
  }

  public getConnection(): Observable<WebSocketChatResponse> {
    return this.receive('connect');
  }

  private emit<T>(event: websocketEventKey, payload: T) {
    return this.socket.emit(WS_EVENT[event], payload);
  }

  private receive(event: websocketEventKey): Observable<WebSocketChatResponse> {
    return this.socket.fromEvent<WebSocketChatResponse>(WS_EVENT[event]);
  }
}
