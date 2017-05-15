import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { ICity, CITIES } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";

@Injectable()
export class CitiesData {
    private cities = new BehaviorSubject<ICity[]>([]);

    constructor(private api: Api, private storage: Storage) {
        storage.ready().then(() => {
            this.storage.get(CITIES).then((cities: ICity[]) => {
                if (cities) {
                    this.cities.next(cities);
                }
            });
        });
    }
    get Cities() {
        return this.cities.asObservable();
    }
    getCities(forceUpdate?: boolean) {
        if (forceUpdate || this.cities.getValue().length === 0) {
            this.api.get("cities").subscribe((cities: ICity[]) => {
                this.cities.next(cities);
            });
        }
    }
}
