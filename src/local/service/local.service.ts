import { ILocalService } from './local.service.interface';
import { LocalCreateDto } from '../dto/local-create.dto';
import { LocalModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { types } from '../../types';
import { Local } from '../entity/local.entity';
import { ILocalRepository } from '../repository/local.repository.interface';
import { LocalUpdateDto } from '../dto/local-update.dto';

@injectable()
export class LocalService implements ILocalService {
	constructor(@inject(types.LocalRepository) private localRepository: ILocalRepository) {}
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

	async remove(id: number): Promise<LocalModel | null> {
		return await this.localRepository.remove(id);
	}

	async update(local: LocalUpdateDto): Promise<LocalModel | null> {
		const updateLocal = new Local(local.code, local.name);
		return await this.localRepository.update(local.id, updateLocal);
	}
}
