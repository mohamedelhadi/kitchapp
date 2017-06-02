import { Logger } from "../../helpers/index";
import { IAppSettings } from "../../contracts/index";
import { TranslationKeys, Language } from "../../contracts/index";
import { settings } from "../index";

export abstract class BasePage {
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    constructor({ logger }: { logger: Logger }) {
        settings.subscribe(settings => this.settings = settings);
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
