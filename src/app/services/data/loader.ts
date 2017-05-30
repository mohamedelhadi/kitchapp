import { Injectable } from "@angular/core";
import { CitiesData, CuisinesData } from "./index";
import { Logger } from "../../helpers/index";
import { RestaurantsData } from "../../../pages/restaurants/restaurants.data";

@Injectable()
export class DataLoader {

    constructor(private logger: Logger, private restaurants: RestaurantsData, private cities: CitiesData, private cuisines: CuisinesData) { }
    load() {
        this.cities.getCities(true, { showLoading: false, handleError: false });
        this.cuisines.getCuisines(true, { showLoading: false, handleError: false });
        this.restaurants.getRestaurants(true, { showLoading: false, handleError: false });
    }
}
