import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { ICuisine, CUISINES } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";

import * as savedCuisines from "../../../data/cuisines.json";

@Injectable()
export class CuisinesData {
    private cuisines = new BehaviorSubject<ICuisine[]>([]);

    constructor(private api: Api, private storage: Storage) {
        storage.ready().then(() => {
            this.storage.get(CUISINES).then((cuisines: ICuisine[]) => {
                if (cuisines) {
                    this.cuisines.next(cuisines);
                } else {
                    this.cuisines.next(savedCuisines);
                }
            });
        });
    }
    get Cuisines() {
        return this.cuisines.asObservable();
    }
    getCuisines(forceUpdate?: boolean) {
        if (forceUpdate || this.cuisines.getValue().length === 0) {
            this.api.get("cuisines").subscribe((cuisines: ICuisine[]) => {
                this.cuisines.next(cuisines);
            });
        }
    }
}
