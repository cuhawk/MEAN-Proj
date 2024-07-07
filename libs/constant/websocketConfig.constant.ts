type websocketEventKey = |
  'connect' |
  'join' |
  'send' |
  'leave';

type websocketEventValue = |
  'connected' |
  'joinedRoom' |
  'complexMessage' |
  'leaveRoom';

const WS_EVENT : Record<websocketEventKey, websocketEventValue> = {
  'connect': 'connected',
  'join': 'joinedRoom',
  'send': 'complexMessage',
  'leave': 'leaveRoom',
}

export { websocketEventValue, websocketEventKey, WS_EVENT };
