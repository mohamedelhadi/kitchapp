import { Component, OnInit } from "@angular/core";
import { Configuration } from "../../environments/env.config";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { MenuController, NavController } from "ionic-angular";
import { IRestaurant } from "../../app/contracts/interfaces";;
import { RestaurantsData } from "./restaurants.data";
import { RestaurantTabs } from "../restaurant/tabs/tabs";

@Component({
    selector: "page-restaurants",
    templateUrl: "restaurants.html"
})
export class Restaurants implements OnInit {

    query: string = "";

    constructor(private config: Configuration, private api: Api, private logger: Logger, private data: RestaurantsData, private menu: MenuController, private navCtrl: NavController) {
        // this.menu.enable(false);
    }

    ngOnInit() {
        this.data.getRestaurants();
        //this.viewRestaurant(this.data.Restaurants.getValue()[0]);
    }

    ionViewDidLoad() {
    }

    viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, restaurant); // Restaurant, restaurant);
    }

    search() {
    }
}
