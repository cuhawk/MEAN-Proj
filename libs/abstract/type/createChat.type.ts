import { typeResponseMessage } from "../../constant/response.constant";

/**
 * @param { string } uuid - Identifier for chat room
 * @param { typeResponseMessage } message - message constant
 */
export type createChat = {
  uuid: string,
  message: typeResponseMessage,
}
