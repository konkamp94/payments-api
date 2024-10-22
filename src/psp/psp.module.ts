import { Module } from '@nestjs/common';
import { PspService } from './psp.service';
import { PspController } from './psp.controller';

@Module({
  controllers: [PspController],
  providers: [PspService],
})
export class PspModule { }
