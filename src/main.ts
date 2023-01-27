import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { types } from './types';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(types.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(types.Application);
	app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
