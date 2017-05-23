import { NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IRestaurant } from "../../../contracts";
import { Restaurant } from "../details/restaurant";
import { Branches } from "../branches/branches";
import { Deals } from "../deals/deals";

@Component({
    templateUrl: "tabs.html"
})
export class RestaurantTabs {
    index: number;
    tab1 = Restaurant;
    tab2 = Branches;
    tab3 = Deals;
    restaurant: IRestaurant;
    query: string;

    constructor(private navParams: NavParams) {
        this.index = navParams.data.tabIndex || 0;
        this.restaurant = navParams.data.restaurant;
        this.query = navParams.data.query;
    }
}
