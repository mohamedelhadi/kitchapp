import { Component, OnInit } from "@angular/core";
import { Configuration } from "../../environments/env.config";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { MenuController, NavController, PopoverController } from "ionic-angular";
import { IRestaurant, IRestaurantsOrderSettings } from "../../contracts";
import { RestaurantsData } from "./restaurants.data";
import { RestaurantsPopover } from "./popover/popover";
import { Observable } from "rxjs/Observable";
import { orderBy } from "lodash";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
// import * as moment from 'moment';

@Component({
    selector: "page-restaurants",
    templateUrl: "restaurants.html"
})
export class Restaurants implements OnInit {

    query: string = "";
    orderSettings: IRestaurantsOrderSettings = { AtoZ: true, Nearby: false, TopRated: false }; // should load from storage, maybe in v2?
    restaurants: Observable<IRestaurant[]>;

    constructor(private config: Configuration, private api: Api, private logger: Logger, private data: RestaurantsData, private menu: MenuController, private navCtrl: NavController, private popoverCtrl: PopoverController) {
        // this.menu.enable(false);
    }

    ngOnInit() {
        this.data.getRestaurants();
        this.restaurants = this.data.Restaurants;
        this.order();
    }

    viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, restaurant); // Restaurant, restaurant);
    }

    search() {
        // search
    }

    showPopover(ev) {
        const popover = this.popoverCtrl.create(RestaurantsPopover, { settings: this.orderSettings, order: this.order });
        popover.present({ ev });
    }

    order() {
        this.restaurants = this.data.Restaurants.map(i => this.orderRestaurants(i));
    }

    orderRestaurants(restaurants: IRestaurant[]) {
        const order = this.orderSettings.AtoZ ? "asc" : "desc";
        restaurants = orderBy(restaurants, restaurant => restaurant.Name, [order]);
        // nearby
        // top rated
        return restaurants;
    }
}
