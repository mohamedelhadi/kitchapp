import JsonToTypeScript from "json-to-typescript";
let fs = require("fs");

const input = JSON.parse(fs.readFileSync("src/assets/i18n/en.json"));
const output = JsonToTypeScript("Keys", input);
fs.writeFileSync("src/app/contracts/translation.keys.d.ts", output);