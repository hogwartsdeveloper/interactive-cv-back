import { Local } from '../entity/local.entity';
import { LocalModel } from '@prisma/client';

export interface ILocalRepository {
	create: (local: Local) => Promise<LocalModel>;
	find: (code: string) => Promise<LocalModel | null>;
	getAll: () => Promise<LocalModel[] | null>;
	remove: (id: number) => Promise<LocalModel | null>;
	update: (id: number, local: Local) => Promise<LocalModel | null>;
}
