import "reflect-metadata";
import { ILocalRepository } from "../repository/local.repository.interface";
import { Container } from "inversify";
import { ILocalService } from "./local.service.interface";
import { types } from "../../types";
import { LocalService } from "./local.service";
import { Local } from "../entity/local.entity";
import { LocalModel } from "@prisma/client";

const LocalRepositoryMock: ILocalRepository = {
  create: jest.fn(),
  getAll: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
};

const container = new Container();
let localRepository: ILocalRepository;
let localService: ILocalService;

beforeAll(() => {
  container.bind<ILocalService>(types.LocalService).to(LocalService);
  container
    .bind<ILocalRepository>(types.LocalRepository)
    .toConstantValue(LocalRepositoryMock);

  localService = container.get<ILocalService>(types.LocalService);
  localRepository = container.get<ILocalRepository>(types.LocalRepository);
});

describe("Local Service", () => {
  it("createdLocal", async () => {
    localRepository.create = jest.fn().mockImplementationOnce(
      (local: Local): LocalModel => ({
        id: 1,
        code: local.code,
      })
    );

    const res = await localService.create({
      code: "test",
      name: { en: "test", ru: "", kz: "" },
    });

    expect(res?.id).toEqual(1);
    expect(res?.code).toEqual("test");
  });

  it("getAllLocal", async () => {
    localRepository.getAll = jest.fn().mockReturnValue([
      { id: 1, code: "test" },
      { id: 2, code: "test" },
    ]);

    const res = await localService.getAll();

    expect(res).toHaveLength(2);
  });

  it("removeLocal", async () => {
    localRepository.remove = jest.fn().mockReturnValue({ id: 1, code: "test" });
    const res = await localRepository.remove(1);

    expect(res?.id).toEqual(1);
    expect(res?.code).toEqual("test");
  });

  it("updateLocal", async () => {
    localRepository.update = jest.fn().mockImplementationOnce(
      (id: number, local: Local): LocalModel => ({
        id,
        code: local.code,
      })
    );

    const res = await localService.update({
      id: 1,
      code: "test2",
      name: { en: "", ru: "", kz: "" },
    });

    expect(res?.id).toEqual(1);
    expect(res?.code).toEqual("test2");
  });
});
