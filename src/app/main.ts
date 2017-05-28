import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

import { AppModule } from "./app.module";
import { Environments } from "./environments/configuration";
import { Configuration } from "./environments/env.config";

if (Configuration.Instance.Environment === Environments.Production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
