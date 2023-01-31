import { LocalCreateDto } from '../dto/local-create.dto';
import { LocalModel } from '@prisma/client';
import { LocalUpdateDto } from '../dto/local-update.dto';

export interface ILocalService {
	create: (local: LocalCreateDto) => Promise<LocalModel | null>;
	getAll: () => Promise<LocalModel[] | null>;
	remove: (id: number) => Promise<LocalModel | null>;
	update: (local: LocalUpdateDto) => Promise<LocalModel | null>;
}
