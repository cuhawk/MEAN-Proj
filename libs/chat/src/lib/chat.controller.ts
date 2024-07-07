import { Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { typeResponseMessage } from "../../../constant/response.constant";
import { createChat } from "../../../abstract/type/createChat.type";

/**
 * Chat Endpoints
 * @description CRUD Chat Room
 * @class
 */
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService
  ) {}

  /**
   *  Register Chat Room
   *  @description Generate UUID and register it.
   *  @method
   */
  @Get('create')
  @HttpCode(HttpStatus.CREATED)
  public registerChatRoom(): createChat | HttpException {
    try {
      const UUID: string = this.chatService.generateUUID();
      return {
        uuid: UUID,
        message: this.chatService.createChatRoom(UUID)
      } as unknown as createChat;
    } catch (e: unknown|Error|string) {
      return new HttpException( e instanceof Error ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Session Join
   * @description Verify if UUID is register
   * @method
   * @param { string } uuid - UUID of session chat
   */
  @Get('join/:uuid')
  @HttpCode(HttpStatus.OK)
  public joinChatRoom(@Param("uuid") uuid: string): { message: typeResponseMessage } | HttpException {
    if (this.chatService.existChatRoom(uuid)) {
      return { message: "CHAT_ROOM_EXISTS" };
    }

    throw new HttpException("CHAT_ROOM_DONT_EXISTS", HttpStatus.NOT_FOUND);
  }

  /**
   *  Unregister Chat Room
   *  @method
   *  @param { string } uuid - UUID of session chat
   *  @return typeResponseMessage
   */
  @Get('destroy/:uuid')
  @HttpCode(HttpStatus.OK)
  public destroyChatRoom(@Param("uuid") uuid: string): { message: typeResponseMessage } | HttpException {
    try {
      return { message: this.chatService.destroySessionChat(uuid) };
    } catch(e: Error | unknown) {
      if (e instanceof Error && e?.message === 'CHAT_ROOM_DONT_EXISTS') {
        return new NotFoundException(e);
      }
      return new HttpException( e instanceof Error ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
