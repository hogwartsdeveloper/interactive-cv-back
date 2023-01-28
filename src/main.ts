import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { types } from './types';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { IUserController } from './user/user.controller.interface';
import { UserController } from './user/user.controller';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './user/repository/user.repository.interface';
import { UserRepository } from './user/repository/user.repository';
import { IUserService } from './user/service/user.service.interface';
import { UserService } from './user/service/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IExceptionFilter } from './error/exception.filter.interface';
import { ExceptionFilter } from './error/exception.filter';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(types.Application).to(App);
	bind<ILogger>(types.Logger).to(LoggerService);
	bind<IConfigService>(types.ConfigService).to(ConfigService);
	bind<PrismaService>(types.PrismaService).to(PrismaService);
	bind<IExceptionFilter>(types.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(types.UserController).to(UserController);
	bind<IUserRepository>(types.UserRepository).to(UserRepository);
	bind<IUserService>(types.UserService).to(UserService);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(types.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
