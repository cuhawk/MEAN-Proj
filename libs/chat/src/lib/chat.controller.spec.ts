import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { typeResponseMessage } from "../../../constant/response.constant";
import { HttpException, NotFoundException } from "@nestjs/common";

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  let registeredChatRoom: string = undefined;

  it('should return response with uuid and message', () => {
    const SERVICE: { uuid: string; message: typeResponseMessage } | HttpException = controller.registerChatRoom();
    registeredChatRoom = !(SERVICE instanceof HttpException) ? SERVICE.uuid : undefined;
    expect(SERVICE).toMatchObject({
      uuid: expect.stringMatching(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/),
      message: 'CHAT_ROOM_REGISTER'
    });
  });

  it('should return message if uuid is not exits in register', () => {
    expect(() => controller.joinChatRoom('toto')).toThrow('CHAT_ROOM_DONT_EXISTS');
  });

  it('should return message if uuid exits in register', () => {
    expect(controller.joinChatRoom(registeredChatRoom)).toStrictEqual({ message: "CHAT_ROOM_EXISTS" });
  });

  it('should return message for announced to be session chat was been destroy', (): void => {
    expect(controller.destroyChatRoom(registeredChatRoom)).toStrictEqual({ message: 'CHAT_ROOM_DESTROYED' } );
  });

  it('should return message for announced to be session chat was bot been destroy', (): void => {
    expect(controller.destroyChatRoom(registeredChatRoom))
      .toBeInstanceOf(NotFoundException);
  });

});
