import { Inject, Injectable } from '@nestjs/common';
import { CustomRepository } from './shared/repository/custom-repository.interface';
import { Merchant } from './merchant/entities/merchant.entity';

@Injectable()
export class AppService {

  constructor() { }

  getHello(): string {
    return 'Hello World!';
  }
}

