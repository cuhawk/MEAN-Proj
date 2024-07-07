/**
 * WebSocket Chat Response
 * @type { time: number, sender: string, message: string }
 */
export type WebSocketChatResponse = {
  time: number,
  sender: string,
  message: string,
};

/**
 * Chat payload
 * @type { room: string, sender: string, message: string }
 */
export type ChatPayload = {
  room: string,
  sender: string,
  message: string,
};
