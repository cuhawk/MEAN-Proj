import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { typeResponseMessage } from "../../../constant/response.constant";

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an UUID ', async () => {
    expect(service.generateUUID()).toMatch(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  });

  it('should return message for register ChatId', () => {
    expect(service.createChatRoom(service.generateUUID())).toBe<typeResponseMessage>('CHAT_ROOM_REGISTER');
  })

  it('should return false on chat room which not exists', () => {
    expect(service.existChatRoom(service.generateUUID())).toBeFalsy();
  });

  it("should return true on chat room which exists", () => {
    const UUID: string =  service.generateUUID(); // Originally must be UUID v4.
    service.createChatRoom(UUID);
    expect(service.existChatRoom(UUID)).toBeTruthy();
  });

  it("should return 'CHAT_ROOM_NOT_DESTROYED' with chat room which not exists", () => {
    expect(() => service.destroySessionChat(service.generateUUID())).toThrow('CHAT_ROOM_NOT_DESTROYED');
  });

  it("should return 'CHAT_ROOM_DESTROYED' with chat room which exist", () => {
    const UUID: string = service.generateUUID();
    expect(service.createChatRoom(UUID)).toBe<typeResponseMessage>('CHAT_ROOM_REGISTER');
    expect(service.destroySessionChat(UUID)).toBe<typeResponseMessage>('CHAT_ROOM_DESTROYED');
  });
});
