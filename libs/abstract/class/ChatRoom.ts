/**
 * Chat Room
 * @description Define chat room for front
 * @param { number } id - Identifier
 * @param { string } roomId - Room identifier
 * @param { string } [nickname] - Username
 */
export class ChatRoom {
  constructor(
    public id: number,
    public roomId: string,
    public nickname?: string,
  ) {
  }
}
