import { Injectable } from "@angular/core";
import { CitiesData, CuisinesData, RestaurantsData } from "./index";
import { Logger } from "../../helpers/index";

@Injectable()
export class DataLoader {

    constructor(private logger: Logger, private restaurants: RestaurantsData, private cities: CitiesData, private cuisines: CuisinesData) { }
    public load() {
        this.cities.getCities(true, { showLoading: false, handleError: false });
        this.cuisines.getCuisines(true, { showLoading: false, handleError: false });
        this.restaurants.getRestaurants(true, { showLoading: false, handleError: false });
    }
}
