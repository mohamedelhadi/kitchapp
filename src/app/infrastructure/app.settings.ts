import { Injectable } from "@angular/core";
import { defaults } from "lodash";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IAppSettings, Language } from "../../contracts/index";
import { Configuration } from "../../environments/env.config";

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
