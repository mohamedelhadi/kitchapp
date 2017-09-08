import { Injectable } from "@angular/core";
import { CitiesData, CuisinesData, RestaurantsData } from "./index";

@Injectable()
export class DataLoader {

    constructor(private restaurants: RestaurantsData, private cities: CitiesData, private cuisines: CuisinesData) { }
    public load() {
        this.cities.getCities(true, { handleLoading: false, handleError: false });
        this.cuisines.getCuisines(true, { handleLoading: false, handleError: false });
        this.restaurants.getRestaurants(true, { handleLoading: false, handleError: false });
    }
}
