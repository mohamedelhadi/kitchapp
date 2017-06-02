import { default as language } from "../../assets/i18n/en.json";
import { ITranslationKeys } from "./translation.interface";

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

replaceValuesWithNamespace(language);

export const TranslationKeys = language as ITranslationKeys;