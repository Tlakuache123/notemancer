import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyExistance(title: string, idAuthor: number) {
    const noteExists = await this.prisma.note.findFirst({
      where: { title: title, authorId: idAuthor },
      select: { id: true },
    });

    return noteExists !== null;
  }

  async create(createNoteDto: CreateNoteDto, idAuthor: number) {
    const { title } = createNoteDto;

    if (await this.verifyExistance(title, idAuthor))
      throw new HttpException(
        'Note with the same title already exists',
        HttpStatus.CONFLICT,
      );

    return this.prisma.note.create({
      data: { ...createNoteDto, author: { connect: { id: idAuthor } } },
    });
  }

  async createByFile(
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
    idAuthor: number,
  ) {
    const { title } = uploadFileDto;

    if (await this.verifyExistance(title, idAuthor))
      throw new HttpException(
        'Note with the same title already exists',
        HttpStatus.CONFLICT,
      );

    const content: string = file.buffer.toString();

    return this.prisma.note.create({
      data: {
        title: title,
        content: content,
        author: { connect: { id: idAuthor } },
      },
    });
  }

  findAll(idAuthor: number) {
    return this.prisma.note.findMany({ where: { authorId: idAuthor } });
  }

  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({ where: { id: id } });
    if (!note) throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    return note;
  }

  async update(id: number, idAuthor: number, updateNoteDto: UpdateNoteDto) {
    const { title } = updateNoteDto;

    if (await this.verifyExistance(title, idAuthor))
      throw new HttpException(
        'Note with the same title already exists',
        HttpStatus.CONFLICT,
      );

    return this.prisma.note.update({ where: { id: id }, data: updateNoteDto });
  }

  remove(id: number) {
    return this.prisma.note.delete({ where: { id: id } });
  }
}
