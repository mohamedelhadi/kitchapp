import { ITranslationKeys } from "./translation.interface";
// import { default as language } from "../../assets/i18n/en.json";
import { en as language } from "../../assets/i18n/en";
import { cloneDeep } from "lodash";

const replaceValuesWithNamespace = (item, ancestor?) => {
    for (const property in item) {
        if (typeof (item[property]) === "object") {
            const newAncestor = (ancestor ? ancestor + "." : "") + property;
            replaceValuesWithNamespace(item[property], newAncestor);
        } else if (typeof (item[property]) === "string" || item[property] instanceof String) {
            item[property] = (ancestor ? ancestor + "." : "") + property;
        }
    }
};
const keysTable = cloneDeep(language);
replaceValuesWithNamespace(keysTable);
export const TranslationKeys = keysTable as ITranslationKeys;
