import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import 'web-animations-js/web-animations.min';

import { AppModule } from './app.module';
import { Environments } from './config/configuration';
import { Configuration } from './config/env.config';

if (Configuration.instance.environment === Environments.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
