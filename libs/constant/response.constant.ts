type typeResponseMessage = |
  'CHAT_ROOM_REGISTER' |
  'CHAT_ROOM_NOT_REGISTER' |
  'CHAT_ROOM_EXISTS' |
  'CHAT_ROOM_DONT_EXISTS' |
  'CHAT_ROOM_DESTROYED' |
  'CHAT_ROOM_NOT_DESTROYED' |
  'SESSION_CHAT_PURGED' |
  'TOO_MANY_PARTICIPANT'
const RESPONSE_MESSAGE: Record<typeResponseMessage, string> = {
  'CHAT_ROOM_REGISTER': 'Chat room is register.',
  'CHAT_ROOM_NOT_REGISTER': 'Chat room was not register, please contact support.',
  'CHAT_ROOM_EXISTS': 'Chat room exists already.',
  'CHAT_ROOM_DONT_EXISTS': 'Chat room don\'t exist.',
  'CHAT_ROOM_DESTROYED': 'Chat room is destroyed.',
  'CHAT_ROOM_NOT_DESTROYED': 'Chat room was not destroy or don\'t exist.',
  'SESSION_CHAT_PURGED': 'Chat sessions purged.',
  'TOO_MANY_PARTICIPANT': 'There is too many participant',
};

export { RESPONSE_MESSAGE, typeResponseMessage };
