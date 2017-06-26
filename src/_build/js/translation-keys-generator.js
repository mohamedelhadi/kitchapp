import JsonToTypeScript from "json-to-typescript";
import * as fs from "fs";
// import * as input from "../../assets/i18n/en.json";
/*import {
    en as input
} from "../../assets/i18n/en.ts";*/
const input = JSON.parse(fs.readFileSync("src/assets/i18n/en.json"));
const output = JsonToTypeScript("ITranslationKeys", input);
fs.writeFileSync("src/app/contracts/translation.interface.d.ts", output);