import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// Se exporta el service para que lo use el modulo auth
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
