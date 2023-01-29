import { ILocalService } from './local.service.interface';
import { LocalCreateDto } from '../dto/local-create.dto';
import { LocalModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { types } from '../../types';
import { LocalRepository } from '../repository/local.repository';
import { Local } from '../entity/local.entity';

@injectable()
export class LocalService implements ILocalService {
	constructor(@inject(types.LocalRepository) private localRepository: LocalRepository) {}
	async create(local: LocalCreateDto): Promise<LocalModel | null> {
		const existed = await this.localRepository.find(local.code);
		if (existed) {
			return null;
		}

		const newLocal = new Local(local.code, local.name);
		return this.localRepository.create(newLocal);
	}

	async getAll(): Promise<LocalModel[] | null> {
		return await this.localRepository.getAll();
	}
}