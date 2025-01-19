import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should hash a password and verify it', async () => {
    const hash = await service.hashPassword('test');

    expect(await service.comparePasswords('test', hash)).toBe(true);
  });
});
