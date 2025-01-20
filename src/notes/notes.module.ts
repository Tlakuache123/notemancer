import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    PrismaService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class NotesModule {}
