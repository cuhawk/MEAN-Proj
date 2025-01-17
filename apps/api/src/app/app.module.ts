import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ChatModule } from "@cuhawk-mean/chat";

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
