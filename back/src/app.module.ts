import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { GameController } from './game/game.controller';


@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: '1234', /* mdp : toto -->samir et pierre / mdp : 1234 --> haroun */
    database: 'transcendence',
    autoLoadEntities: true,
    synchronize: true,
  }), ChatModule, GameModule],
  controllers: [AppController, UserController, GameController],
  providers: [AppService],
})
export class AppModule {}
