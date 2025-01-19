import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from 'src/common/hashing.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, HashingService],
  exports: [UsersService],
})
export class UsersModule {}
