import { Logger } from "../../helpers/index";
import { AppSettings } from "../index";
import { IAppSettings } from "../../contracts/index";
import { TranslationKeys, Language } from "../../contracts/index";

export abstract class BasePage {
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    constructor({ appSettings, logger }: { appSettings: AppSettings, logger: Logger }) {
        appSettings.Settings.subscribe(settings => {
            this.settings = settings;
        });
    }
    isRtl() {
        return this.settings && this.settings.language === Language.ar;
    }
    isLtr() {
        return !this.isRtl();
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
