import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { CustomRepository } from 'src/shared/repository/custom-repository.interface';
import { Merchant } from './entities/merchant.entity';
import { MerchantCustomRepository } from './repository/merchant-custom-repository.interface';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService, @Inject('MERCHANT_CUSTOM_REPOSITORY') private merchantRepository: MerchantCustomRepository) { }

  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantService.create(createMerchantDto);
  }

  @Get()
  findAll() {
    return this.merchantRepository.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantService.update(+id, updateMerchantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchantService.remove(+id);
  }
}
