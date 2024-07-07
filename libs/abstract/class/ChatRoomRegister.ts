import { ChatRoom } from "./ChatRoom";
import { WsException } from "@nestjs/websockets";

/**
 * Chat Room Register Class
 * @class
 * @description Define chat room into register
 * @template T
 * @extends ChatRoom
 * @param { number } id - identifier
 * @param { string } roomId - Room identifier
 * @property { number } participantNumber - Number of participant
 * @property { Array<T> } trace - Collection of trace with type defined by "Generic Type" called T
 */
export class ChatRoomRegister<T> extends ChatRoom {
  private participantNumber: number;
  private trace: Array<T>;
  constructor(
    public override id: number,
    public override roomId: string,
  ) {
    super(id, roomId);
    this.participantNumber = 0;
    this.trace = new Array<T>();
  }

  /**
   * Increment participant number
   * @description increment number of participant when user connect a chat room. It's accessible from outside
   * @method
   * @return void
   * @public
   */
  public increment(): void {
    this.participantNumber++;
  }

  /**
   * Decrement participant number
   * @description decrement number of participant when user connect
   * @method
   * @return void
   * @public
   */
  public decrement(): void {
    if (this.participantNumber > 0) {
      this.participantNumber--;
    } else {
      throw new WsException('NO_PARTICIPANT');
    }
  }

  /**
   * Accessor for participant number
   * @description Accessor for participant number and return number of participant
   * @method
   * @return number
   * @public
   */
  public getParticipantNumber(): number {
    return this.participantNumber;
  }

  /**
   * Add trace to chat room register
   * @description Add trace to chat room register to an array.
   * @param { T } trace - It's just a log of processing
   * @method
   * @return void
   * @public
   */
  public addTrace(trace: T): void {
    this.trace.push(trace);
  }

  public getTraces(): Array<T> {
    return this.trace;
  }
}
