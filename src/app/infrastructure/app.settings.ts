import { Injectable } from "@angular/core";
import { defaults } from "lodash";
import { Storage } from "@ionic/storage";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { IAppSettings, Language, defaultLanguage, SETTINGS, supportedLanguages } from "../contracts/index";
import { Configuration } from "../environments/env.config";
import { TranslateService } from "@ngx-translate/core";
import { Globalization } from "@ionic-native/globalization";
import { Platform } from "ionic-angular";
/*import { default as en } from "../../assets/i18n/en.json";
import { default as ar } from "../../assets/i18n/ar.json";*/
import { en } from "../../assets/i18n/en";
import { ar } from "../../assets/i18n/ar";

export const settings = new ReplaySubject<IAppSettings>(1);
export const onLanguageApplied = new ReplaySubject(1);

@Injectable()
export class AppSettings {

    constructor(
        private config: Configuration,
        private storage: Storage,
        private translate: TranslateService,
        private globalization: Globalization,
        private platform: Platform) {
        this.translate.setTranslation("en", en);
        this.translate.setTranslation("ar", ar);
        this.storage.ready().then(() => {
            this.storage.get(SETTINGS).then((savedSetting: IAppSettings) => {
                // load settings from storage
                if (savedSetting) {
                    settings.next(savedSetting);
                } else {
                    this.storage.set(SETTINGS, { language: defaultLanguage, firstLaunch: false })
                        .then(() => {
                            settings.next({ language: defaultLanguage, firstLaunch: true });
                        });
                }
            });
        });
    }
    get Settings() {
        return settings.asObservable();
    }
    initLanguage() {
        this.translate.setDefaultLang(Language[defaultLanguage]);
        settings.take(1).subscribe(setting => {
            if (setting.firstLaunch) {
                if ((window as any).cordova) {
                    this.globalization.getPreferredLanguage().then(result => {
                        const langCode = result.value.substring(0, 2).toLowerCase();
                        const language = supportedLanguages.some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                        this.setLanguage(language, setting);
                    });
                } else {
                    const langCode = (this.translate.getBrowserLang() || Language[defaultLanguage]).substring(0, 2).toLowerCase();
                    const language = supportedLanguages.some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                    this.setLanguage(language, setting);
                }
            } else {
                this.applyLanguage(Language[setting.language]);
            }
        });
    }
    setLanguage(language: Language, setting: IAppSettings) {
        this.applyLanguage(Language[language]);
        setting.language = language;
        settings.next(setting);
        this.saveSelectedLanguage(setting.language);
    }
    private applyLanguage(langCode: string) {
        this.translate.use(langCode).first().subscribe(() => onLanguageApplied.next(""));
        this.platform.setLang(langCode, true);
        this.platform.setDir(langCode === Language[Language.ar] ? "rtl" : "ltr", true);
    }
    private saveSelectedLanguage(language: Language) {
        this.storage.ready().then(() => {
            this.storage.get(SETTINGS).then((setting: IAppSettings) => {
                setting.language = language;
                this.storage.set(SETTINGS, setting);
            });
        });
    }
}
