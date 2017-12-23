import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/take';
import defaults from 'lodash/defaults';
import {
    IAppSettings, Language, defaultLanguage, SETTINGS, supportedLanguages
} from '../contracts/index';

export const Settings$ = new ReplaySubject<IAppSettings>(1);

@Injectable()
export class AppSettings {

    constructor(
        private storage: Storage,
        private translate: TranslateService,
        private globalization: Globalization,
        private platform: Platform) {
        this.storage.get(SETTINGS).then((savedSettings: IAppSettings) => {
            if (savedSettings) {
                Settings$.next(this.invalidate(savedSettings));
            } else {
                this.storage
                    .set(SETTINGS, { language: defaultLanguage, isFirstLaunch: false })
                    .then(() => {
                        Settings$.next({
                            language: defaultLanguage,
                            isFirstLaunch: true,
                            dateFormat: 'DD-MMM-YYYY',
                            dateTimeFormat: 'HH:mm DD-MMM-YYYY'
                        });
                    });
            }
        });
    }
    private invalidate(settings: IAppSettings) {
        return defaults(settings, {
            language: defaultLanguage,
            isFirstLaunch: true,
            dateFormat: 'DD-MMM-YYYY',
            dateTimeFormat: 'HH:mm DD-MMM-YYYY'
        });
    }
    public initLanguage() {
        this.translate.setDefaultLang(Language[defaultLanguage]);
        Settings$.first().subscribe(settings => {
            if (settings.isFirstLaunch) {
                if (this.platform.is('cordova')) {
                    this.globalization.getPreferredLanguage().then(result => {
                        const langCode = result.value.substring(0, 2).toLowerCase();
                        const language: Language = supportedLanguages
                            .some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                        this.setLanguage(language, settings);
                    });
                } else {
                    const langCode = (this.translate.getBrowserLang() || Language[defaultLanguage])
                        .substring(0, 2).toLowerCase();
                    const language: Language = supportedLanguages
                        .some(code => code === langCode) ? Language[langCode] : defaultLanguage;
                    this.setLanguage(language, settings);
                }
            } else {
                this.applyLanguage(settings.language);
            }
        });
    }
    public setLanguage(language: Language, settings: IAppSettings) {
        settings.language = language;
        Settings$.next(settings);
        this.saveSelectedLanguage(settings.language);
        setTimeout(() => {
            this.applyLanguage(language);
        });
    }
    private applyLanguage(language: Language) {
        const langCode = Language[language];
        this.translate.use(langCode);
        this.platform.setLang(langCode, true);
        this.platform.setDir(language === Language.ar ? 'rtl' : 'ltr', true);
    }
    private async saveSelectedLanguage(language: Language) {
        const settings: IAppSettings = await this.storage.get(SETTINGS);
        settings.language = language;
        this.storage.set(SETTINGS, settings);
    }
}
