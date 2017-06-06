import JsonToTypeScript from "json-to-typescript";
import * as fs from "fs";
// import * as input from "../../assets/i18n/en.json";
import {
    en as input
} from "../../assets/i18n/en.ts";

const output = JsonToTypeScript("ITranslationKeys", input);
fs.writeFileSync("src/app/contracts/translation.interface.ts", output);