import { Injectable } from '@nestjs/common';
import { CreatePspDto } from './dto/create-psp.dto';
import { UpdatePspDto } from './dto/update-psp.dto';

@Injectable()
export class PspService {
  create(createPspDto: CreatePspDto) {
    return 'This action adds a new psp';
  }

  findAll() {
    return `This action returns all psp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psp`;
  }

  update(id: number, updatePspDto: UpdatePspDto) {
    return `This action updates a #${id} psp`;
  }

  remove(id: number) {
    return `This action removes a #${id} psp`;
  }
}
