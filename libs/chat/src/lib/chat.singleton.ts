import { ChatRoom } from "../../../abstract/class/ChatRoom";
import { typeResponseMessage } from "../../../constant/response.constant";
import { ChatRoomRegister } from "../../../abstract/class/ChatRoomRegister";
import { ChatTrace } from "../../../abstract/class/chatTrace.class";

/**
 * Chat Singleton
 * @description Temporary memory for register information
 * @property { Array<ChatRoomRegister<ChatTrace>> } currentChats
 * @class
 *
 */
export class ChatSingleton {

  /**
   * Chats currently used
   * @static
   * @private
   */
  private static currentChats: Array<ChatRoomRegister<ChatTrace>>;

  private constructor() {}

  /**
   * Get all chat registered
   * @static
   * @method
   * @return Array<ChatRoomRegister<ChatTrace>>
   * @public
   */
  public static getCurrentChats(): Array<ChatRoomRegister<ChatTrace>> {
    if (!ChatSingleton.currentChats) {
      ChatSingleton.currentChats = new Array<ChatRoomRegister<ChatTrace>>();
    }

    return ChatSingleton.currentChats;
  }

  /**
   * Register a chat
   * @description Permit to register a chat information
   * @static
   * @method
   * @param { ChatRoomRegister<ChatTrace> } data - Data received
   * @return typeResponseMessage
   * @public
   */
  public static registerChat(data: ChatRoomRegister<ChatTrace>): typeResponseMessage {
      ChatSingleton.currentChats?.push(data);

      if (ChatSingleton.currentChats?.includes(data)) {
        return 'CHAT_ROOM_REGISTER';
      }

      throw new Error('CHAT_ROOM_NOT_REGISTER');
  }

  /**
   * Get a chat room
   * @description Permit to find a chat room in currentChats acccording with a room identifier
   * @static
   * @method
   * @param { string } roomId - Room identifier
   * @return ChatRoomRegister<ChatTrace> | undefined
   * @public
   */
  public static getChatRoom(roomId: string): ChatRoomRegister<ChatTrace> | undefined {
      return ChatSingleton.currentChats.find(
        (registered: ChatRoom): boolean => registered.roomId === roomId
      );
  }

  /**
   * Mutator by increment Participant Counter
   * @description Increment counter when a user join a chat room
   * @static
   * @method
   * @param { string } roomId - Room identifier
   * @return void
   * @public
   */
  public static incrementParticipantCounter(roomId: string): void {
    this.getChatRoom(roomId).increment();
  }

  /**
   * Mutator by decrement Participant Counter
   * @description Decrement counter when a user leave a chat room
   * @static
   * @method
   * @param { string } roomId - Room identifier
   * @return void
   * @public
   */
  public static decrementParticipantCounter(roomId: string): void {
    this.getChatRoom(roomId).decrement();
  }

  /**
   * Accessor for get participant number
   * @description Get participant number
   * @static
   * @method
   * @param { string } roomId - Room identifier
   * @return number
   * @public
   */
  public static getParticipantNumber(roomId: string): number {
    return this.getChatRoom(roomId).getParticipantNumber();
  }

  /**
   * @description
   * @static
   * @param roomId
   * @param maxParticipant
   * @return boolean
   * @public
   */
  public static haveEmptySlot(roomId: string, maxParticipant: number): boolean {
    return this.getParticipantNumber(roomId) < maxParticipant
  }

  /**
   * Delete a chat
   * @description Destroy a chat on demand according a room identifier
   * @static
   * @method
   * @param { string } roomId - Room identifier
   * @return typeResponseMessage
   * @public
   */
  public static destroyChat(roomId: string): typeResponseMessage {
      const LENGTH: number = ChatSingleton.currentChats.length;

      if (Array.isArray(ChatSingleton.currentChats) && LENGTH === 0) {
        throw new Error('CHAT_ROOM_DONT_EXISTS');
      }

      ChatSingleton.currentChats = ChatSingleton.currentChats.filter(
        (registered: ChatRoom): boolean => registered.roomId !== roomId
      );

      if (ChatSingleton.currentChats.length < LENGTH) {
        return 'CHAT_ROOM_DESTROYED';
      }

      throw new Error('CHAT_ROOM_NOT_DESTROYED');
  }

  /**
   * Delete all chats currently used
   * @description Empty all chats used
   * @static
   * @method
   * @return typeResponseMessage
   * @public
   */
  public static purgeAllSessionChat(): typeResponseMessage {
    ChatSingleton.currentChats = [];
    return 'SESSION_CHAT_PURGED';
  }

  /**
   * Create trace to register
   * @description Search the room according to roomId and push trace into register
   * @static
   * @method
   * @param { string } room - Room identifier
   * @param { ChatTrace } dataTrace - Trace object
   * @return void
   * @public
   */
  public static addTrace(room: string, dataTrace: ChatTrace): void {
    this.getChatRoom(room).addTrace(dataTrace);
  }
}
