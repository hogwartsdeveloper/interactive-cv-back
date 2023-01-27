import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { types } from './types';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(types.Application).to(App);
	bind<ILogger>(types.Logger).to(LoggerService);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(types.Application);
	app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
