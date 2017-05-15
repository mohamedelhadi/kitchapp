import { Injectable } from "@angular/core";
import { Configuration } from "../../environments/env.config";
import { defaults } from "lodash";
import { IAppSettings, Language } from "../../contracts";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class AppSettings {

    private settings = new BehaviorSubject<IAppSettings>({ language: Language.en });
    constructor(private config: Configuration, private storage: Storage) {
        // load settings from storage
    }
    get Settings() {
        return this.settings.asObservable();
    }
}
