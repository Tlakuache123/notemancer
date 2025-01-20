import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from 'src/common/hashing.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    // Verify duplicated user
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const hashedPassword = await this.hashingService.hashPassword(password);

    return this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (
      !user ||
      (await this.hashingService.comparePasswords(password, user.password))
    ) {
      return null;
    }

    const { password: _password, ...payload } = user;

    return payload;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, username: true, createAt: true },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        createAt: true,
        updateAt: true,
      },
    });
  }

  findOneByEmail(
    email: string,
    fields: Prisma.UserSelect = {
      id: true,
      name: true,
      username: true,
      createAt: true,
      updateAt: true,
    },
  ) {
    return this.prisma.user.findFirst({
      where: { email: email },
      select: fields,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }
}
