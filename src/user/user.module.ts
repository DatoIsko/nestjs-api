import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { AuthGuard } from 'src/shared/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthGuard],
  controllers: [UserController]
})
export class UserModule {}
