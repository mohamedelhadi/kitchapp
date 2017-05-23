import { IAppSettings } from "../../../contracts/index";
import { Configuration } from "../../../environments/env.config";
import { Logger } from "../../helpers/index";
import { AppSettings } from "../index";

export abstract class BasePage {
    protected settings: IAppSettings;
    constructor({ config, appSettings, logger }: { config: Configuration, appSettings: AppSettings, logger: Logger }) {
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
