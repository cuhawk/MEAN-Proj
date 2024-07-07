import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { ChatPayload, cuhawkChat } from "../../../abstract";
import { Server, Socket } from "socket.io";
import { WS_EVENT } from "../../../constant/websocketConfig.constant";
import GATEWAY_META_OPTIONS from "../../../constant/gatewayMetadataOptions.constant";
import { websocketConfig } from "../../../constant/socket.constant";
import { ChatTrace, ChatTraceSenderInfo, ChatTraceStatus } from "../../../abstract/class/chatTrace.class";
import { Handshake } from "socket.io/dist/socket";
import { ChatService } from "./chat.service";


/**
 * WebSocket Gateway Class
 * @class
 * @implements OnGatewayInit
 * @implements OnGatewayConnection
 * @implements OnGatewayDisconnect
 * @description Websocket with logger, just for chatting. It uses @nestjs/websockets and socket.io.
 * Strongly inspired by John Johnson's NestJS WebSockets: {@link https://www.youtube.com/watch?v=0zyYhm5MjJ4&list=PLBHzlq7ILbsaL1sZxJIxrc4ofSPAMSTzr}
 * and official doc: {@link https://docs.nestjs.com/websockets/gateways }
 * @module
 */
@WebSocketGateway(8080, GATEWAY_META_OPTIONS)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger("ChatGateway");

  @WebSocketServer() server: Server;

  private readonly MAX_PARTICIPANT: number = websocketConfig.maxParticipant;

  constructor(private service: ChatService) {
  }

  public afterInit(): void {
    this.logger.log("Initialized!");
  }


  public handleConnection(@ConnectedSocket() client: Socket): WsResponse<boolean> {
    this.logger.log(`Client connected from ${client.handshake.address} at ${client.handshake.time} with ${client.handshake.headers["user-agent"]}`);
    return { event: WS_EVENT["connect"], data: true };
  }

  public handleDisconnect(@ConnectedSocket() client: Socket): WsResponse<boolean> {
    this.logger.log(`Client disconnected from ${client.handshake.address} at ${client.handshake.time} with ${client.handshake.headers["user-agent"]}`);
    return { event: WS_EVENT["connect"], data: false };
  }

  /**
   * Simple Message Websocket Event
   * @description Websocket 'Simple Messsage' for testing.
   * @method
   * @param { string } message - a simple massage
   * @deprecated Useless it's just for knows if the gateway works! Maybe recyclate for does great announcement.
   */
  @SubscribeMessage("simpleMessage")
  public handleSimpleMessage(@MessageBody() message: string): WsResponse<string> {
    return { event: "simpleMessage", data: message };
  }

  /**
   * Message Websocket Event
   * @description Main websocket for chatting. It emits message for all users on same room.
   * @method
   * @param { string } payload - payload of websocket @see {@link ChatPayload} type
   */
  @SubscribeMessage(WS_EVENT["send"])
  public handleMessage(@MessageBody() payload: ChatPayload): boolean {
    const { room } = payload;
    return this.server.to(room).emit(WS_EVENT["send"], new cuhawkChat(payload).sendPayloadFiltered());
  }

  /**
   * Join Room Web Socket Event
   * @description Event for join a room and emit a message into websocket.
   * @method
   * @param { Socket } client - Main object for interacting with the client.
   * @param { Omit<ChatPayload> } payload - Payload of request.
   * @return boolean
   */
  @SubscribeMessage(WS_EVENT["join"])
  public handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: Omit<ChatPayload, "message">): boolean | WsException {
    const { room, sender } = payload;
    const META_TRACE: ChatTraceSenderInfo = this.setMetaInfo(client);
    const MESSAGE_SUBSTITUTION = "NO_MESSAGE_FOR_JOIN";
    try {

      this.ChatRoomNotExist(room);

      if (this.service.verifyAvailableSlot(room, this.MAX_PARTICIPANT)) {
        client.join(room);
        this.service.incrementParticipantCounter(room);

        const RESULT_SUCCESS: cuhawkChat = new cuhawkChat({ ...payload, message: `${sender} was joined the room.` });
        this.addTraceability(payload, MESSAGE_SUBSTITUTION, "COMPLETED", JSON.stringify(RESULT_SUCCESS), META_TRACE);

        return this.server.to(room).emit(WS_EVENT["join"], RESULT_SUCCESS);
      } else {
        const RESULT_ERROR: Error = new Error("TOO_MANY_PARTICIPANT");
        this.addTraceability(payload, MESSAGE_SUBSTITUTION, "ERROR", JSON.stringify(RESULT_ERROR), META_TRACE);
        throw RESULT_ERROR;
      }
    } catch (e: Error | string | any) {
      return new WsException(e instanceof Error ? e?.message : e);
    }
  }

  /**
   * Leave Room Web Socket Event
   * @description Event for announce a user leave the room for the another clients and permit client can leave it.
   * @method
   * @param { Socket } client - Main object for interacting with the client.
   * @param { Omit<ChatPayload> } payload - Payload of request.
   * @return Promise<void> | void
   */
  @SubscribeMessage(WS_EVENT["leave"])
  public handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: Omit<ChatPayload, "message">): Promise<void> | void | WsException {
    const { room, sender } = payload;
    const META_TRACE: ChatTraceSenderInfo = this.setMetaInfo(client);
    const MESSAGE_SUBSTITUTION = "NO_MESSAGE_FOR_LEAVE";
    try {
      const RESULT_SUCCESS: cuhawkChat = new cuhawkChat({ ...payload, message: `${sender} was leaved the room.` });
      this.addTraceability(payload, MESSAGE_SUBSTITUTION, "COMPLETED", JSON.stringify(RESULT_SUCCESS), META_TRACE);

      this.service.decrementParticipantCounter(room);

      this.server.to(room).emit(WS_EVENT["leave"], RESULT_SUCCESS);
      return client.leave(room);
    } catch (e: Error | unknown) {
      const RESULT_ERROR: WsException = e instanceof Error ? new WsException(e?.message) : new WsException("INTERNAL_ERROR");
      this.addTraceability(payload, MESSAGE_SUBSTITUTION, "ERROR", JSON.stringify(RESULT_ERROR), META_TRACE);

      if (e instanceof Error) {
        client.leave(room);
        return RESULT_ERROR;
      }

      return client.leave(room);
    }
  }

  /**
   * Create meta information with header client
   * @description Take Client {@link Socket} and it property called handshake {@link Handshake} for returning IP address V4, request time, and UserAgent with format "<WebBrowserCompanyName>/<version> (<OperatingSystemCore>; <OperatingSystemWithProcessor> rv:<ConcurrentVersionSystem>; <RenderEngineSoftwareName>/<RenderEngineSoftwareVersion> <WebBrowserName>/<WebBrowserVersion>) "
   * @method
   * @param { Socket } client - Main object for interacting with the client.
   * @private
   */
  private setMetaInfo(client: Socket): ChatTraceSenderInfo {
    const META: Handshake = client.handshake;
    return new ChatTraceSenderInfo(META?.time, META?.address, META?.headers["user-agent"]);
  }


  /**
   * Trace setter
   * @description Create Trace ready to add
   * @method
   * @param { ChatPayload } payload - Payload from received with websocket
   * @param { ChatTraceStatus } status - Status of trace. @see {@link ChatTraceStatus}
   * @param { string } response - Serialize response
   * @param { ChatTraceSenderInfo } meta - Chat trace header information from sending.
   * @return ChatTrace
   * @private
   */
  private setTrace(payload: ChatPayload, status: ChatTraceStatus, response: string, meta: ChatTraceSenderInfo): ChatTrace {
    return new ChatTrace(payload.sender, payload.message, status, response, meta);
  }

  /**
   * Chat Room not Exist
   * @description used for test if chat room don't exist and will throw an {@link Error}
   * @method
   * @param { string } room - room identifier. Originally, it's UUID v4
   * @return void
   * @private
   */
  private ChatRoomNotExist(room: string): void {
    if (!this.service.existChatRoom(room)) {
      throw new Error("CHAT_ROOM_DONT_EXISTS");
    }
  }

  /**
   * Prepare a trace and send to register.
   * @description
   * @method
   * @param { Omit<ChatPayload, 'message'> } payload - Payload received @see {@link ChatPayload }
   * @param { string } formattedMessage - Replacement message which not exist on join or leave.
   * @param { ChatTraceStatus } status - Status of trace. @see {@link ChatTraceStatus}
   * @param { string } serializeResponse - Serialize response.
   * @param { ChatTraceSenderInfo } meta - Request header @see {@link ChatTraceSenderInfo}
   * @return void
   * @private
   */
  private addTraceability(payload: Omit<ChatPayload, "message">, formattedMessage: string, status: ChatTraceStatus, serializeResponse: string, meta: ChatTraceSenderInfo): void {
    const RESULT: ChatTrace = this.setTrace({
      ...payload,
      message: formattedMessage
    } as ChatPayload, status, serializeResponse, meta);
    this.service.addTrace(payload.room, RESULT);
  }
}
