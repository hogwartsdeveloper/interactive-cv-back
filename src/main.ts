import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { types } from "./types";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { IUserController } from "./user/user.controller.interface";
import { UserController } from "./user/user.controller";
import { PrismaService } from "./database/prisma.service";
import { IUserRepository } from "./user/repository/user.repository.interface";
import { UserRepository } from "./user/repository/user.repository";
import { IUserService } from "./user/service/user.service.interface";
import { UserService } from "./user/service/user.service";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { IExceptionFilter } from "./error/exception.filter.interface";
import { ExceptionFilter } from "./error/exception.filter";
import { ILocalController } from "./local/local.controller.interface";
import { LocalController } from "./local/local.controller";
import { ILocalRepository } from "./local/repository/local.repository.interface";
import { LocalRepository } from "./local/repository/local.repository";
import { ILocalService } from "./local/service/local.service.interface";
import { LocalService } from "./local/service/local.service";
import { ISupportController } from "./support/support.controller.interface";
import { SupportController } from "./support/support.controller";
import { ISupportService } from "./support/service/support.service.interface";
import { SupportService } from "./support/service/support.service";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(types.Application).to(App);
  bind<ILogger>(types.Logger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(types.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<PrismaService>(types.PrismaService).to(PrismaService).inSingletonScope();
  bind<IExceptionFilter>(types.ExceptionFilter).to(ExceptionFilter);
  bind<IUserController>(types.UserController).to(UserController);
  bind<IUserRepository>(types.UserRepository).to(UserRepository);
  bind<IUserService>(types.UserService).to(UserService);
  bind<ILocalController>(types.LocalController).to(LocalController);
  bind<ILocalRepository>(types.LocalRepository).to(LocalRepository);
  bind<ILocalService>(types.LocalService).to(LocalService);
  bind<ISupportController>(types.SupportController).to(SupportController);
  bind<ISupportService>(types.SupportService).to(SupportService);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(types.Application);
  await app.init();
  return { app, appContainer };
}

export const boot = bootstrap();
