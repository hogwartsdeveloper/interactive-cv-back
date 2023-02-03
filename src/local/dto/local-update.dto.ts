import {
	IsDefined,
	IsNotEmptyObject,
	IsNumber,
	IsObject,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocalNameDto {
	@IsString({ message: 'En not specified' })
	en: string;
	@IsString({ message: 'Kz not specified' })
	kz: string;
	@IsString({ message: 'ru not specified' })
	ru: string;
}

export class LocalUpdateDto {
	@IsNumber({}, { message: 'Id not specified' })
	id: number;
	@IsString({ message: 'Code not specified' })
	code: string;
	@ValidateNested()
	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@Type(() => LocalNameDto)
	name: LocalNameDto;
}
