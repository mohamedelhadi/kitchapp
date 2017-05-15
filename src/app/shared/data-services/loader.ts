import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Logger } from "../../helpers/index";
import { RestaurantsData } from "../../../pages/restaurants/restaurants.data";
import { CitiesData, CuisinesData } from "./index";

@Injectable()
export class DataLoader {

    constructor(private logger: Logger, private restaurants: RestaurantsData, private cities: CitiesData, private cuisines: CuisinesData) {
    }

    load() {
        this.cities.getCities(true);
        this.cuisines.getCuisines(true);
        this.restaurants.getRestaurants(true);
    }
}
