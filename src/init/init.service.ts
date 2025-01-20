import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashingService } from 'src/common/hashing.service';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class InitService {
  private logger = new Logger(InitService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminUser();
  }

  private async ensureAdminUser() {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@admin.com';
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'root123';

    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      this.logger.log('Admin user already exists');
      return;
    }

    const hashedPassword =
      await this.hashingService.hashPassword(adminPassword);

    await this.prisma.user.create({
      data: {
        name: 'Admin',
        username: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    this.logger.log('Admin user has been created');
  }
}
