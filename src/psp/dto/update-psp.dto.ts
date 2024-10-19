import { PartialType } from '@nestjs/mapped-types';
import { CreatePspDto } from './create-psp.dto';

export class UpdatePspDto extends PartialType(CreatePspDto) {}
