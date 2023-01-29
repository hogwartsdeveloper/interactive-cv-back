import { ILocalRepository } from './local.repository.interface';
import { Local } from '../entity/local.entity';
import { LocalModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { types } from '../../types';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class LocalRepository implements ILocalRepository {
	constructor(@inject(types.PrismaService) private prismaService: PrismaService) {}

	async create(local: Local): Promise<LocalModel> {
		return this.prismaService.client.localModel.create({
			data: {
				code: local.code,
				name: { create: { en: local.name.en, kz: local.name.kz, ru: local.name.ru } },
			},
		});
	}

	getAll(): Promise<LocalModel[] | null> {
		return this.prismaService.client.localModel.findMany();
	}
}