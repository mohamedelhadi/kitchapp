import { Configuration } from "../environments/env.config";
import { AppSettings } from "../app/services/index";
import { Logger } from "../app/helpers/index";
import { IAppSettings } from "../contracts/index";

export abstract class BasePage {
    protected settings: IAppSettings;
    constructor(config: Configuration, appSettings: AppSettings, logger: Logger) {
        appSettings.Settings.subscribe(settings => {
            this.settings = settings;
        });
    }
    /*ionViewDidLoad() {
    }
    ionViewWillEnter() {
    }
    ionViewWillLeave() {
    }
    ionViewDidEnter() {
    }*/
}
