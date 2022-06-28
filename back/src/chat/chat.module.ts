import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { Participants } from './entities/participants.entity';
import { Messages } from './entities/messages.entity';
import { UserModule } from 'src/user/user.module';
import { ChatGateaway } from './chat.gateaway';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Participants, Messages]), UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateaway],
  exports: [ChatService],
})
export class ChatModule {}
