import { ITranslationKeys } from "./translation.interface";
import { default as translationTable } from "../../../assets/i18n/en.json";
import { replace } from "values-to-keys";

const keysTable = translationTable;
replace(keysTable);
export const TranslationKeys = keysTable as ITranslationKeys;