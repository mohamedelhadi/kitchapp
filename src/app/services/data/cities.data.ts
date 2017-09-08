import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs/BehaviorSubject";

import * as bundledCities from "../../../assets/data/cities.json";
import { ICity, CITIES, IApiOptions } from "../../contracts/index";

@Injectable()
export class CitiesData {
    private cities = new BehaviorSubject<ICity[]>([]);

    constructor(private api: Api, private storage: Storage) {
        this.init();
    }
    private async init() {
        const cities: ICity[] = await this.storage.get(CITIES);
        this.cities.next(cities || bundledCities);
    }
    public get cities$() {
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
