import { NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { Restaurant } from "../details/restaurant";
import { Branches } from "../branches/branches";
import { IRestaurant, IAppSettings, TranslationKeys } from "../../../app/contracts/index";
import { Deals } from "../../deals/deals";

@Component({
    templateUrl: "tabs.html"
})
export class RestaurantTabs {
    public index: number;
    public tab1 = Restaurant;
    public tab2 = Branches;
    public tab3 = Deals;
    public restaurant: IRestaurant;
    public query: string;
    protected translation = TranslationKeys;

    constructor(private navParams: NavParams) {
        this.index = navParams.data.tabIndex || 0;
        this.restaurant = navParams.data.restaurant;
        this.query = navParams.data.query;
    }
}
