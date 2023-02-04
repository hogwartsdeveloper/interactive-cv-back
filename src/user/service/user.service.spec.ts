import "reflect-metadata";
import { IConfigService } from "../../config/config.service.interface";
import { IUserRepository } from "../repository/user.repository.interface";
import { Container } from "inversify";
import { IUserService } from "./user.service.interface";
import { types } from "../../types";
import { UserService } from "./user.service";
import { User } from "../entity/user.entity";
import { UserModel } from "@prisma/client";

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(types.UserService).to(UserService);
  container
    .bind<IConfigService>(types.ConfigService)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<IUserRepository>(types.UserRepository)
    .toConstantValue(UserRepositoryMock);

  configService = container.get<IConfigService>(types.ConfigService);
  userRepository = container.get<IUserRepository>(types.UserRepository);
  userService = container.get<IUserService>(types.UserService);
});

let createdUser: UserModel | null;

describe("User Service", () => {
  it("createUser", async () => {
    configService.get = jest.fn().mockReturnValue("SALT");
    userRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        role: "USER",
        id: 1,
      })
    );

    createdUser = await userService.create({
      email: "a@a.ru",
      name: "Zhannur",
      password: "1",
    });

    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual("1");
    expect(createdUser?.role).toEqual("USER");
  });

  it("validateUser - success", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validate({
      email: "a@a.ru",
      password: "1",
    });

    expect(res).toBeTruthy();
  });

  it("validateUser - wrong", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.validate({
      email: "a@a.ru",
      password: "2",
    });

    expect(res).toBeFalsy();
  });

  it("getUserInfo - success", async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
    const res = await userService.getInfo("a@a.ru");

    expect(res?.email).toEqual("a@a.ru");
    expect(res?.id).toEqual(1);
    expect(res?.password).not.toEqual("1");
    expect(res?.role).toEqual("USER");
    expect(res?.name).toEqual("Zhannur");
  });
});
