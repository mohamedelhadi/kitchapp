import { Injectable } from "@angular/core";
import { defaults } from "lodash";
import { Storage } from "@ionic/storage";
import { IAppSettings, Language } from "../../contracts/index";
import { Configuration } from "../../environments/env.config";
import { ReplaySubject } from "rxjs/ReplaySubject";

@Injectable()
export class AppSettings {

    private settings = new ReplaySubject<IAppSettings>(1);
    constructor(private config: Configuration, private storage: Storage) {
        // load settings from storage
        this.settings.next({ language: Language.en });
    }
    get Settings() {
        return this.settings.asObservable();
    }
}
