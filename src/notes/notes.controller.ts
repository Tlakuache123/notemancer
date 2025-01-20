import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UserFromJwt } from 'src/types/user-jwt.interface';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: UserFromJwt) {
    return this.notesService.create(createNoteDto, user.sid);
  }

  @Get()
  findAll(@GetUser() user: UserFromJwt) {
    return this.notesService.findAll(user.sid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @GetUser() user: UserFromJwt,
  ) {
    return this.notesService.update(+id, user.sid, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
