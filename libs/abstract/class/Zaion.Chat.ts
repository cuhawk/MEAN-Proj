import { ChatAbstract } from "./Chat.abstract";
import { ChatPayload, WebSocketChatResponse } from "../type/chat.type";

/**
 * cuhawk Chat Class
 * @description Chat Message with automated time
 * @param { ChatPayload } data - Data received
 * @property { number } time - UNIX time stamp
 * @property { string } sender - username
 * @property { string } message - user message received
 * @class
 * @extends ChatAbstract<WebSocketChatResponse>
 */
export class cuhawkChat extends ChatAbstract<WebSocketChatResponse> {

  protected time: number;
  protected sender: string;
  protected message: string;

  constructor(data: ChatPayload) {
    super();
    this.time = Date.now();
    this.sender = data.sender;
    this.message = data.message;
  }

  /**
   * Format message
   * @description format message with implement methods
   * @method
   * @return string
   * @protected
   */
  protected filterMessage(): string {
    let incomingMessage: string = this.message;
    this.formatSentences(incomingMessage);
    return incomingMessage;
  }

  /**
   * Formatted payload
   * @description return object with filtered message
   * @method
   * @return WebSocketChatResponse
   * @public
   */
  public sendPayloadFiltered(): WebSocketChatResponse {
    return {
      time: this.time,
      sender: this.sender,
      message: this.filterMessage()
    };
  }

  /**
   * Capitalize incoming message
   * @description Divide the message for all the points between several letters
   * and followed by a space or with the last point and capitalize the first letter.
   * Finally, the occurrences are joined again with deletion of the last space.
   * @param { string } message - Incoming message
   * @method
   * @return string
   * @private
   */
  private formatSentences(message: string): string {
    return message.split('(?<=\w+)\.\s|\.$').map( (sentence: string) => this.capitalize(sentence)).join('. ').trim();
  }

  /**
   * Capitalize
   * @description Add uppercase to first letter and all the rest in lowerCase
   * @param { string } message - Sentence
   * @method
   * @return string
   * @private
   */
  private capitalize(message: string): Capitalize<string> {
    return (message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()) as Capitalize<string>;
  }
}
