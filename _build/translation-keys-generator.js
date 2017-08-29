var generator = require("translation-keys-generator").generator;
generator.generateAsFile({ json: "src/assets/i18n/en.json", path: "src/app/contracts/translation/translation.interface.d.ts" });