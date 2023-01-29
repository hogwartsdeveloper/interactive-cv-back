import { Local } from '../entity/local.entity';
import { LocalModel } from '@prisma/client';

export interface ILocalRepository {
	create: (local: Local) => Promise<LocalModel>;
	getAll: () => Promise<LocalModel[] | null>;
}
