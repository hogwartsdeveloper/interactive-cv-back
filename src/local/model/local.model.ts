import { LocalModel, LocalName } from "@prisma/client";

export type Lang = "en" | "kz" | "ru";

export type LangTranslate = { [key: string]: string };

export type LocalModelCustom = LocalModel & { name: LocalName | null };
