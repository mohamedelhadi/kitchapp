import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs/BehaviorSubject";

import * as bundledCuisines from "../../../assets/data/cuisines.json";
import { ICuisine, CUISINES, IApiOptions } from "../../contracts/index";

@Injectable()
export class CuisinesData {
    private cuisines = new BehaviorSubject<ICuisine[]>([]);

    constructor(private api: Api, private storage: Storage) {
        this.init();
    }
    private async init() {
        const cuisines: ICuisine[] = await this.storage.get(CUISINES);
        this.cuisines.next(cuisines || bundledCuisines);
    }
    get cuisines$() {
        return this.cuisines.asObservable();
    }
    public getCuisines(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.cuisines.getValue().length === 0) {
            this.api.get("cuisines", options).subscribe((cuisines: ICuisine[]) => {
                this.cuisines.next(cuisines);
            });
        }
    }
}
