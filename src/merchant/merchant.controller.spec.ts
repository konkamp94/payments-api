import { Test, TestingModule } from '@nestjs/testing';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { create } from 'domain';
import { find } from 'rxjs';

describe('MerchantController', () => {
  let controller: MerchantController;
  let mockMerchantRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findEnabledPspByMerchantId: jest.fn(),
    findByClientId: jest.fn()
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [
        MerchantService,
        {
          provide: 'MERCHANT_CUSTOM_REPOSITORY',
          useValue: mockMerchantRepository
        }
      ],
    }).compile();

    controller = module.get<MerchantController>(MerchantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
