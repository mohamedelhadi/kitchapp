import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";

import * as bundledCities from "../../../assets/data/cities.json";
import { ICity, CITIES, IApiOptions } from "../../contracts/index";

@Injectable()
export class CitiesData {
    private cities = new BehaviorSubject<ICity[]>([]);

    constructor(private api: Api, private storage: Storage) {
        storage.ready().then(() => {
            this.storage.get(CITIES).then((cities: ICity[]) => {
                if (cities) {
                    this.cities.next(cities);
                } else {
                    this.cities.next(bundledCities);
                }
            });
        });
    }
    get Cities() {
        return this.cities.asObservable();
    }
    public getCities(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.cities.getValue().length === 0) {
            this.api.get("cities", options).subscribe((cities: ICity[]) => {
                this.cities.next(cities);
            });
        }
    }
}
