import { Local } from "../entity/local.entity";
import { LocalModelCustom } from "../model/local.model";

export interface ILocalRepository {
  create: (local: Local) => Promise<LocalModelCustom>;
  find: (code: string) => Promise<LocalModelCustom | null>;
  getAll: () => Promise<LocalModelCustom[] | null>;
  remove: (id: number) => Promise<LocalModelCustom | null>;
  update: (id: number, local: Local) => Promise<LocalModelCustom | null>;
}
