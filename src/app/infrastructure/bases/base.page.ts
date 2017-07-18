import { Logger } from "../../helpers/index";
import { IAppSettings, TranslationKeys, Language } from "../../contracts/index";
import { settings } from "../index";

export abstract class BasePage {
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    constructor({ logger }: { logger: Logger }) {
        settings.subscribe(settings => this.settings = settings);
    }
    public isRtl() {
        return this.settings && this.settings.language === Language.ar;
    }
    public isLtr() {
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
