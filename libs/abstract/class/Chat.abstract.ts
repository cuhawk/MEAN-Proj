/**
 * @author Renaud racinet
 * @description Abstract class
 * @class
 * @abstract
 */
export abstract class ChatAbstract<T> {
  /**
   * @property { number } time - Server time of message at reception
   * @abstract
   * @protected
   */
  protected abstract time: number;
  /**
   * @property { string } sender - Sender name
   * @abstract
   * @protected
   */
  protected abstract sender: string;
  /**
   * @property { string } message - Incoming message
   * @abstract
   * @protected
   */
  protected abstract message: string;

  /**
   * Filter message
   * @abstract
   * @method
   * @protected
   */
  protected abstract filterMessage(): string

  /**
   * Send payload filtered
   * @abstract
   * @method
   * @protected
   */
  protected abstract sendPayloadFiltered(): T
}
