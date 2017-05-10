import { Settings } from "../../settings/settings";
import { Favorites } from "../../favorites/favorites";
import { NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IRestaurant } from "../../../contracts";
import { Restaurant } from "../details/restaurant";

@Component({
    templateUrl: "tabs.html"
})
export class RestaurantTabs {
    index: number;
    tab1 = Restaurant;
    tab2 = Settings;
    tab3 = Favorites;
    restaurant: IRestaurant;

    constructor(private navParams: NavParams) {
        this.index = navParams.data.tabIndex || 0;
        this.restaurant = navParams.data;
    }
}
