/**
 * @type { sender: string }
 */
export type ChatTraceStatus = 'REGISTERED' | 'ERROR' | 'COMPLETED' | 'UNREGISTERED';

/**
 * Chat Trace
 * @description Trace of Chat with much information, such as sender name, messages, header and status
 * @class
 * @param { string } sender - username
 * @param { string } senderMessage - message of sender
 * @param { ChatTraceStatus } status - flow status
 * @param { string } responseMessage - response message
 * @param { ChatTraceSenderInfo } senderInfo - Sender's header information
 */
export class ChatTrace {

  constructor(
    public sender: string,
    public senderMessage: string,
    public status: ChatTraceStatus,
    public responseMessage: string,
    public senderInfo?: ChatTraceSenderInfo,
  ) {}
}

/**
 *  Chat trace header information from sending
 *  @description Header information at minimum with date. If available IP address and web browser of user
 *  @class
 *  @param { string } requestDate - date of request
 *  @param { string } [address] - IP Address v4 if available
 *  @param { string } [userAgent] - Browser information with name and version
 */
export class ChatTraceSenderInfo {
  constructor(
    public requestDate: string,
    public address?: string,
    public userAgent?: string,
  ) {}
}
