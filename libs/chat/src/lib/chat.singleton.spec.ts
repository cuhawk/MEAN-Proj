import { ChatSingleton } from "./chat.singleton";
import { ChatRoom } from "../../../abstract/class/ChatRoom";

import * as crypto from "crypto";
import { ChatRoomRegister } from "../../../abstract/class/ChatRoomRegister";
import { ChatTrace, ChatTraceSenderInfo } from "../../../abstract/class/chatTrace.class";
import { cuhawkChat } from "../../../abstract";


const randomNumber = (maxId: number, rangeStart: number = 0) => {
  return Math.ceil(Math.random() * maxId) + rangeStart;
};

const randomIpAddress = () => {
  return `${randomNumber(256)}.${randomNumber(256)}.${randomNumber(256)}.${randomNumber}`;
}

describe('ChatRooms storage', (): void => {
  it("should return a empty array", (): void => {
    expect(ChatSingleton.getCurrentChats()).toStrictEqual([]);
  });

  const RANDOM_ID: number = randomNumber(10);
  const UUID_RANDOMIZE: string = crypto.randomUUID();
  const CHAT_ROOM: ChatRoomRegister<ChatTrace> = new ChatRoomRegister<ChatTrace>(RANDOM_ID, UUID_RANDOMIZE);
  it(`should return message with { id: ${ CHAT_ROOM.id }, roomId: ${ CHAT_ROOM.roomId } }`, (): void => {
    expect(ChatSingleton.registerChat(CHAT_ROOM)).toBe('CHAT_ROOM_REGISTER');
  });

  it(`should return an array with object previously pushed`, (): void => {
    expect(ChatSingleton.getCurrentChats()).toStrictEqual([CHAT_ROOM]);
  });

  const RANGE = randomNumber(10);
  let listChatRoom: Array<ChatRoomRegister<ChatTrace>> = new Array<ChatRoomRegister<ChatTrace>>();
  for (let i = 0; i < RANGE; i ++ ) {
    listChatRoom.push(new ChatRoomRegister<ChatTrace>(randomNumber(30, 10), crypto.randomUUID()));
  }

  it(`should return a collection of chatRoom like ${JSON.stringify([CHAT_ROOM, ...listChatRoom])}`, () => {
    listChatRoom.forEach( (chatRoom: ChatRoomRegister<ChatTrace>) => ChatSingleton.registerChat(chatRoom) );
    expect(ChatSingleton.getCurrentChats()).toStrictEqual(new Array<ChatRoomRegister<ChatTrace>>(CHAT_ROOM, ...listChatRoom));
  });

  it(`should delete on chat room and return message success message: 'Chat room is destroyed'`, (): void => {
    const LIST: Array<ChatRoomRegister<ChatTrace>> = ChatSingleton.getCurrentChats();
    const LENGTH: number = LIST.length;
    const CHOSEN: ChatRoom = LIST[Math.ceil(Math.random() * (LENGTH - 1))];
    const EXPECTED: Array<ChatRoomRegister<ChatTrace>> = LIST.filter( (x: ChatRoomRegister<ChatTrace>): boolean => x.roomId !== CHOSEN.roomId);
    expect(ChatSingleton.destroyChat(CHOSEN.roomId)).toBe('CHAT_ROOM_DESTROYED');
    expect(ChatSingleton.getCurrentChats()).toStrictEqual(EXPECTED);
  });

  it('should return message with UUID don\'t exist in register', (): void => {
    expect(() => ChatSingleton.destroyChat(crypto.randomUUID())).toThrow('CHAT_ROOM_NOT_DESTROYED');
  });

  it('should purge all session chat', (): void => {
    expect(ChatSingleton.purgeAllSessionChat()).toBe('SESSION_CHAT_PURGED');
  });

  it('should return true for have empty slot method with unique id', () => {
    ChatSingleton.registerChat(new ChatRoomRegister<ChatTrace>(randomNumber(10), UUID_RANDOMIZE));
    expect(ChatSingleton.haveEmptySlot(UUID_RANDOMIZE, 2)).toBeTruthy();
  });

  it('should return false for have empty slot method with unique id', () => {
    let participantNumber: number = 1;
    const MAX_PARTICIPANTS: number = 2
    while (participantNumber <= MAX_PARTICIPANTS) {
      ChatSingleton.incrementParticipantCounter(UUID_RANDOMIZE);
      participantNumber++
    }

    expect(ChatSingleton.haveEmptySlot(UUID_RANDOMIZE, MAX_PARTICIPANTS)).toBeFalsy();
  });
});

describe('ChatRooms trace', () => {
  let traceResult : Array<ChatTrace> = new Array<ChatTrace>();
  const ROOM: string = crypto.randomUUID();
  const USERS:  Array<{ name: string, ipAddress: string, userAgent: string }> = [
    { name: 'Dimitry Balakirev', ipAddress: randomIpAddress(), userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0' },
    { name: 'Izabela Wiśniewski', ipAddress: randomIpAddress(), userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0' },
    { name: 'Gina Giordano', ipAddress: randomIpAddress(), userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0' },
    { name: 'Alphonso Abril', ipAddress: randomIpAddress(), userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0' },
    { name: 'Zineb Alaoui', ipAddress: randomIpAddress(), userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0' },
  ];

  it('should return a trace and increment ParticipantCounter on joining', (): void => {

    const DATE: string = new Date(Date.now()).toISOString();
    const EXPECTED: ChatTrace = new ChatTrace(
      USERS[0].name,
      'NO_MESSAGE_FOR_JOIN',
      'COMPLETED',
      JSON.stringify(new cuhawkChat({ room: ROOM, message: `${USERS[0].name} was join the room.`, sender: USERS[0].name } ) ),
      new ChatTraceSenderInfo(DATE, USERS[0]?.ipAddress, USERS[0].userAgent)
    );

    // Initialization.
    ChatSingleton.getCurrentChats();

    // Register.
    ChatSingleton.registerChat(new ChatRoomRegister<ChatTrace>(randomNumber(10), ROOM ));
    ChatSingleton.incrementParticipantCounter(ROOM);
    ChatSingleton.addTrace(ROOM, EXPECTED);

    traceResult.push(EXPECTED);

    expect(ChatSingleton.getParticipantNumber(ROOM)).toBe(1);
    expect(ChatSingleton.getChatRoom(ROOM).getTraces()).toStrictEqual(traceResult);
  });

  it('should return a trace many message from user', () => {
    const MESSAGES : Array<string> = new Array<string>('Welcome to the chat room', 'Hi!', 'Hello', 'Hi, handsome.', 'Guys, you rocks!' );

    const REGISTERER_TRACE_JOIN: ChatTrace = new ChatTrace(
      USERS[0].name,
      MESSAGES[0],
      'COMPLETED',
      JSON.stringify(new cuhawkChat({room: ROOM, message: MESSAGES[0], sender: USERS[0].name})),
      new ChatTraceSenderInfo(new Date(Date.now()).toISOString(), USERS[0].ipAddress, USERS[0].userAgent)
    );
    ChatSingleton.addTrace(ROOM, REGISTERER_TRACE_JOIN);
    traceResult.push(REGISTERER_TRACE_JOIN);

    USERS.forEach( (member: {name: string, ipAddress: string, userAgent: string}, index: number) => {
      // Many user joining room and send a message
      const ITERATION: number = index + 1;
      if (USERS[ITERATION]) {
        ChatSingleton.incrementParticipantCounter(ROOM);

        // Join room
        const CHAT_TRACE_JOIN: ChatTrace = new ChatTrace(
          USERS[ITERATION].name,
          'NO_MESSAGE_ON_JOIN',
          'COMPLETED',
          JSON.stringify(new cuhawkChat({room: ROOM, message: MESSAGES[ITERATION], sender: USERS[ITERATION].name})),
          new ChatTraceSenderInfo(new Date(Date.now()).toISOString(), USERS[ITERATION].ipAddress, USERS[ITERATION].userAgent)
        );
        ChatSingleton.addTrace(ROOM, CHAT_TRACE_JOIN);
        traceResult.push(CHAT_TRACE_JOIN);

        // Send message
        const CHAT_TRACE_MESSAGE: ChatTrace = new ChatTrace(
          USERS[ITERATION].name,
          MESSAGES[ITERATION],
          'COMPLETED',
          JSON.stringify(new cuhawkChat({ room: ROOM, message: MESSAGES[ITERATION], sender: USERS[ITERATION].name } )),
          new ChatTraceSenderInfo(new Date(Date.now()).toISOString(), USERS[ITERATION].ipAddress, USERS[ITERATION].userAgent)
        );
        ChatSingleton.addTrace(ROOM, CHAT_TRACE_MESSAGE);
        traceResult.push(CHAT_TRACE_MESSAGE);
      }
    });

    expect(ChatSingleton.getParticipantNumber(ROOM)).toBe(USERS.length);
    expect(ChatSingleton.getChatRoom(ROOM).getTraces()).toStrictEqual(traceResult);
  });

  it('should return trace when a user leave', () => {
    ChatSingleton.decrementParticipantCounter(ROOM);
    const USER_ITERATION = randomNumber(USERS.length - 1);
    const MESSAGE = 'NO_MESSAGE_ON_LEAVE';
    const LEAVE_CHAT_TRACE: ChatTrace = new ChatTrace(
      USERS[USER_ITERATION].name,
      MESSAGE,
      'COMPLETED',
      JSON.stringify(new cuhawkChat({ room: ROOM, message: MESSAGE, sender: USERS[USER_ITERATION].name})),
      new ChatTraceSenderInfo(new Date(Date.now()).toISOString(), USERS[USER_ITERATION].ipAddress, USERS[USER_ITERATION].userAgent)
    );
    ChatSingleton.addTrace(ROOM, LEAVE_CHAT_TRACE);
    traceResult.push(LEAVE_CHAT_TRACE);

    expect(ChatSingleton.getParticipantNumber(ROOM)).toBe(USERS.length - 1);
    expect(ChatSingleton.getChatRoom(ROOM).getTraces()).toStrictEqual(traceResult);
  });
});
