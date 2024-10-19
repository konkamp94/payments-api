import { Test, TestingModule } from '@nestjs/testing';
import { PspController } from './psp.controller';
import { PspService } from './psp.service';

describe('PspController', () => {
  let controller: PspController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PspController],
      providers: [PspService],
    }).compile();

    controller = module.get<PspController>(PspController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
