import { Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { ChatSingleton } from "./chat.singleton";
import { typeResponseMessage } from "../../../constant/response.constant";
import { ChatRoomRegister } from "../../../abstract/class/ChatRoomRegister";
import { ChatTrace } from "../../../abstract/class/chatTrace.class";

/**
 * Chat service
 * @description Access to different main public method of ChatSingleton for invoke or revoke a chat room.
 * @class
 */
@Injectable()
export class ChatService {
  constructor() {}

  /**
   * Generate UUID V4
   * @description generate UUID Version 4 randomly, it uses crypto, a native module of NodeJS
   * @method
   * @return string
   * @public
   */
  public generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Create Chat Room
   * @description Create Chat Room on demand with a call of ChatSingleton for generate a fake id like a database did it. And at end register new chat with id and a roomId
   * @param { string } roomId - Room identifier
   * @method
   * @return string
   * @public
   */
  public createChatRoom(roomId: string): typeResponseMessage {
    const LIST: Array<ChatRoomRegister<ChatTrace>> = ChatSingleton.getCurrentChats();
    let id = 1;

    if (LIST.length > 0) {
      id = Math.max.apply(LIST.map( (item: ChatRoomRegister<ChatTrace>) => item.id )) + 1;
    }

    return ChatSingleton.registerChat(new ChatRoomRegister<ChatTrace>(id, roomId));
  }

  /**
   * Existing Chat Room
   * @description Verify if chat room is currently exist
   * @param { string } uuid - Room Identifier
   * @method
   * @return boolean
   * @param uuid
   */
  public existChatRoom(uuid: string): boolean {
    return !!ChatSingleton.getChatRoom(uuid);
  }

  /**
   * Destroy Chat Room
   * @description Destroy a chat room in register according to uuid
   * @param { string } uuid - Room identifier
   * @method
   * @return typeResponseMessage
   * @param uuid
   */
  public destroySessionChat(uuid: string): typeResponseMessage {
    return ChatSingleton.destroyChat(uuid);
  }

  /**
   * Send Trace to register
   * @description Prepare info trace and send to register into {@link ChatSingleton.addTrace}.
   * @method
   * @param { string } room - Room identifier UUID V4
   * @param { ChatTrace } trace - Trace to send
   * @return void
   * @public
   */
  public addTrace(room: string, trace: ChatTrace): void {
    ChatSingleton.addTrace(room, trace);
  }

  /**
   * Verify available slot
   * @description Search to know if a free slot is available {@link ChatSingleton.haveEmptySlot}.@
   * @method
   * @param { string } room - Room identifier. Originally UUID V4 {@link crypto.randomUUID }
   * @param { number } maxParticipant - Define a limit.
   * @return boolean
   * @public
   */
  public verifyAvailableSlot(room: string, maxParticipant: number): boolean {
    return ChatSingleton.haveEmptySlot(room, maxParticipant);
  }

  /**
   * Increment Participant Number
   * @description Increment private property Participant Number from ChatRoomRegister @see {@link ChatRoomRegister.participantNumber}
   * @method
   * @param { string } room - Room identifier. Originally UUID V4 {@link crypto.randomUUID }
   * @return void
   * @public
   */
  public incrementParticipantCounter(room: string): void {
    ChatSingleton.incrementParticipantCounter(room);
  }

  /**
   * Decrement Participant Number
   * @description Decrement private property Participant Number from ChatRoomRegister @see {@link ChatRoomRegister.participantNumber}
   * @method
   * @param { string } room - Room identifier. Originally UUID V4 {@link crypto.randomUUID }
   * @return void
   * @public
   */
  public decrementParticipantCounter(room: string): void {
    ChatSingleton.incrementParticipantCounter(room);
  }
}
