import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from 'src/common/hashing.service';

@Module({
  providers: [InitService, PrismaService, HashingService],
})
export class InitModule {}
