import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
// import { GameGateaway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UserModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService, TypeOrmModule]
})
export class GameModule {}
