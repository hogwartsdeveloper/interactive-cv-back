import { ILocalRepository } from "./local.repository.interface";
import { Local } from "../entity/local.entity";
import { inject, injectable } from "inversify";
import { types } from "../../types";
import { PrismaService } from "../../database/prisma.service";
import { LocalModelCustom } from "../model/local.model";

@injectable()
export class LocalRepository implements ILocalRepository {
  constructor(
    @inject(types.PrismaService) private prismaService: PrismaService
  ) {}

  async create(local: Local): Promise<LocalModelCustom> {
    return this.prismaService.client.localModel.create({
      data: {
        code: local.code,
        name: {
          create: { en: local.name.en, kz: local.name.kz, ru: local.name.ru },
        },
      },
      include: { name: true },
    });
  }

  async getAll(): Promise<LocalModelCustom[] | null> {
    return this.prismaService.client.localModel.findMany({
      include: { name: true },
    });
  }

  async find(code: string): Promise<LocalModelCustom | null> {
    return this.prismaService.client.localModel.findFirst({
      where: { code },
      include: { name: true },
    });
  }

  async remove(id: number): Promise<LocalModelCustom | null> {
    return this.prismaService.client.localModel.delete({
      where: { id },
      include: { name: true },
    });
  }

  async update(id: number, local: Local): Promise<LocalModelCustom | null> {
    return this.prismaService.client.localModel.update({
      where: { id },
      data: {
        code: local.code,
        name: {
          update: { en: local.name.en, kz: local.name.kz, ru: local.name.ru },
        },
      },
      include: { name: true },
    });
  }
}
