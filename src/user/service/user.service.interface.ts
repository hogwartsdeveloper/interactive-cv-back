import { UserModel } from '@prisma/client';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';

export interface IUserService {
	create: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validate: (dto: UserLoginDto) => Promise<boolean>;
	getInfo: (email: string) => Promise<UserModel | null>;
}
