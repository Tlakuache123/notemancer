import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UserFromJwt } from 'src/types/user-jwt.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: UserFromJwt) {
    return this.notesService.create(createNoteDto, user.id);
  }

  @Get()
  findAll(@GetUser() user: UserFromJwt) {
    return this.notesService.findAll(user.id);
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
    return this.notesService.update(+id, user.id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'text/markdown' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @GetUser() user: UserFromJwt,
  ) {
    return this.notesService.createByFile(uploadFileDto, file, user.id);
  }
}
