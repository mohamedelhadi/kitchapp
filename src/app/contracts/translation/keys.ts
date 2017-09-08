import { ITranslationKeys } from "./translation.interface";
import { default as translationTable } from "../../../assets/i18n/en.json";
import { replace } from "values-to-keys";

replace(translationTable);
export const TranslationKeys = translationTable as ITranslationKeys;