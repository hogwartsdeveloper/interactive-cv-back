import { LocalCreateDto } from "../dto/local-create.dto";
import { LocalUpdateDto } from "../dto/local-update.dto";
import { Lang, LangTranslate, LocalModelCustom } from "../model/local.model";

export interface ILocalService {
  create: (local: LocalCreateDto) => Promise<LocalModelCustom | null>;
  getAll: () => Promise<LocalModelCustom[] | null>;
  get: (lang: Lang) => Promise<LangTranslate | null>;
  remove: (id: number) => Promise<LocalModelCustom | null>;
  update: (local: LocalUpdateDto) => Promise<LocalModelCustom | null>;
}
