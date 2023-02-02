import { IUserService } from './user.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { types } from '../../types';
import { IUserRepository } from '../repository/user.repository.interface';
import { User } from '../entity/user.entity';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(types.ConfigService) private configService: IConfigService,
		@inject(types.UserRepository) private userRepository: IUserRepository,
	) {}
	async create(dto: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(dto.email);
		if (existedUser) {
			return null;
		}

		const user = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');
		await user.setPassword(dto.password, Number(salt));
		return this.userRepository.create(user);
	}

	async getInfo(email: string): Promise<UserModel | null> {
		return await this.userRepository.find(email);
	}

	async validate(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(dto.email);
		if (!existedUser) {
			return false;
		}

		const user = new User(dto.email, existedUser.name, existedUser.password);
		return user.comparePassword(dto.password);
	}
}
