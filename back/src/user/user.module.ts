import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Friends } from './entities/friends.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Friends, Block]),
    MulterModule.register({dest: './upload',}),],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule]
})
export class UserModule {}
