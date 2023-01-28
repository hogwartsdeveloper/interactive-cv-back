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

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(types.Application).to(App);
	bind<ILogger>(types.Logger).to(LoggerService);
	bind<PrismaService>(types.PrismaService).to(PrismaService);
	bind<IUserController>(types.UserController).to(UserController);
	bind<IUserRepository>(types.UserRepository).to(UserRepository);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(types.Application);
	app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
