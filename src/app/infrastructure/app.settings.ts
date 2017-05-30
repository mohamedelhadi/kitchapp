import { Injectable } from "@angular/core";
import { defaults } from "lodash";
import { Storage } from "@ionic/storage";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { IAppSettings, Language, defaultLanguage, SETTINGS, supportedLanguages } from "../contracts/index";
import { Configuration } from "../environments/env.config";
import { TranslateService } from "@ngx-translate/core";
import { Globalization } from "@ionic-native/globalization";
import { Platform } from "ionic-angular";

@Injectable()
export class AppSettings {

    private settings = new ReplaySubject<IAppSettings>(1);
    constructor(
        private config: Configuration,
        private storage: Storage,
        private translate: TranslateService,
        private globalization: Globalization,
        private platform: Platform) {
        this.storage.ready().then(() => {
            this.storage.get(SETTINGS).then((settings: IAppSettings) => {
                // load settings from storage
                if (settings) {
                    this.settings.next(settings);
                } else {
                    this.storage.set(SETTINGS, { language: defaultLanguage, firstLaunch: false })
                        .then(() => {
                            this.settings.next({ language: defaultLanguage, firstLaunch: true });
                        });
                }
            });
        });
    }
    get Settings() {
        return this.settings.asObservable();
    }
    initLanguage() {
        this.translate.setDefaultLang(Language[defaultLanguage]);
        const subscription = this.settings.subscribe(settings => {
            subscription.unsubscribe();
            if (settings.firstLaunch) {
                if ((window as any).cordova) {
                    this.globalization.getPreferredLanguage().then(result => {
                        const langCode = result.value.substring(0, 2).toLowerCase();
                        const language = supportedLanguages.some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                        this.setLanguage(language, settings);
                    });
                } else {
                    const langCode = (this.translate.getBrowserLang() || Language[defaultLanguage]).substring(0, 2).toLowerCase();
                    const language = supportedLanguages.some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                    this.setLanguage(language, settings);
                }
            } else {
                this.applyLanguage(Language[settings.language]);
            }
        });
    }
    setLanguage(language: Language, settings: IAppSettings) {
        this.applyLanguage(Language[language]);
        settings.language = language;
        this.settings.next(settings);
        this.saveSelectedLanguage(settings.language);
    }
    private applyLanguage(langCode: string) {
        this.translate.use(langCode);
        this.platform.setLang(langCode, true);
        if (langCode === Language[Language.ar]) {
            this.platform.setDir("rtl", true);
        }
    }
    private saveSelectedLanguage(language: Language) {
        this.storage.ready().then(() => {
            this.storage.get(SETTINGS).then((settings: IAppSettings) => {
                settings.language = language;
                this.storage.set(SETTINGS, settings);
            });
        });
    }
}
