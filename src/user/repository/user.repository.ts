import { IUserRepository } from './user.repository.interface';
import { User } from '../entity/user.entity';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { types } from '../../types';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(types.PrismaService) private prismaService: PrismaService) {}
	async create(user: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { email: user.email, name: user.name, password: user.password },
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
}
