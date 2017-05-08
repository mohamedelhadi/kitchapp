import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

import { AppModule } from "./app.module";
import { Configuration } from "../environments/env.config";
import { Environments } from "../environments/configuration";

if (Configuration.Instance.Environment === Environments.Production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
