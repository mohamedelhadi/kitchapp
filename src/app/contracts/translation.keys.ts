import { ITranslationKeys } from "./translation.interface";
import { default as translationTable } from "../../assets/i18n/en.json";

function replaceTranslationsWithKeys(item, namespace?) {
    // tslint:disable-next-line:forin
    for (const property in item) {
        const key = (namespace ? namespace + "." : "") + property;
        if (typeof (item[property]) === "object") {
            replaceTranslationsWithKeys(item[property], key);
        } else if (typeof (item[property]) === "string" || item[property] instanceof String) {
            item[property] = key;
        }
    }
}
const keysTable = translationTable;
replaceTranslationsWithKeys(keysTable);
export const TranslationKeys = keysTable as ITranslationKeys;
