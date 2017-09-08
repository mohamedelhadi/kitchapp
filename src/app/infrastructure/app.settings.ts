import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { IAppSettings, Language, DefaultLanguage, SETTINGS, SupportedLanguages } from "../contracts/index";
import { Configuration } from "../config/env.config";
import { TranslateService } from "@ngx-translate/core";
import { Globalization } from "@ionic-native/globalization";
import { Platform } from "ionic-angular";
import "rxjs/add/operator/take";

export const Settings$ = new ReplaySubject<IAppSettings>(1);

@Injectable()
export class AppSettings {

    constructor(
        private config: Configuration,
        private storage: Storage,
        private translate: TranslateService,
        private globalization: Globalization,
        private platform: Platform) {
        this.storage.get(SETTINGS).then((savedSettings: IAppSettings) => {
            if (savedSettings) {
                Settings$.next(savedSettings);
            } else {
                this.storage
                    .set(SETTINGS, { language: DefaultLanguage, firstLaunch: false })
                    .then(() => {
                        Settings$.next({ language: DefaultLanguage, firstLaunch: true });
                    });
            }
        });
    }
    public initLanguage() {
        this.translate.setDefaultLang(Language[DefaultLanguage]);
        Settings$.take(1).subscribe(settings => {
            if (settings.firstLaunch) {
                if (this.platform.is("cordova")) {
                    this.globalization.getPreferredLanguage().then(result => {
                        const langCode = result.value.substring(0, 2).toLowerCase();
                        const language: Language = SupportedLanguages.some(code => code === langCode) ? Language[langCode] : DefaultLanguage;
                        this.setLanguage(language, settings);
                    });
                } else {
                    const langCode = (this.translate.getBrowserLang() || Language[DefaultLanguage]).substring(0, 2).toLowerCase();
                    const language: Language = SupportedLanguages.some(code => code === langCode) ? Language[langCode] : DefaultLanguage;
                    this.setLanguage(language, settings);
                }
            } else {
                this.applyLanguage(settings.language);
            }
        });
    }
    public setLanguage(language: Language, settings: IAppSettings) {
        this.applyLanguage(language);
        settings.language = language;
        Settings$.next(settings);
        this.saveSelectedLanguage(settings.language);
    }
    private applyLanguage(language: Language) {
        const langCode = Language[language];
        this.translate.use(langCode);
        this.platform.setLang(langCode, true);
        this.platform.setDir(language === Language.ar ? "rtl" : "ltr", true);
    }
    private async saveSelectedLanguage(language: Language) {
        const settings: IAppSettings = await this.storage.get(SETTINGS);
        settings.language = language;
        this.storage.set(SETTINGS, settings);
    }
}
