import { User } from '../entity/user.entity';
import { UserModel } from '@prisma/client';

export interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
