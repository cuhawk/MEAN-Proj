import { Module } from '@nestjs/common';
import { ChatGateway } from "./Chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [],
})
export class ChatModule {}
