import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PspService } from './psp.service';
import { CreatePspDto } from './dto/create-psp.dto';
import { UpdatePspDto } from './dto/update-psp.dto';

@Controller('psp')
export class PspController {
  constructor(private readonly pspService: PspService) {}

  @Post()
  create(@Body() createPspDto: CreatePspDto) {
    return this.pspService.create(createPspDto);
  }

  @Get()
  findAll() {
    return this.pspService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pspService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePspDto: UpdatePspDto) {
    return this.pspService.update(+id, updatePspDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pspService.remove(+id);
  }
}
