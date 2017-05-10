import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { IRestaurant } from "../../contracts";
import { Logger } from "../../app/helpers/logger";
import { Api } from "../../app/services/api";
import { Configuration } from "../../environments/env.config";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { RestaurantTabs } from "../restaurant/tabs/tabs";

@Component({
    selector: "page-favorites",
    templateUrl: "favorites.html"
})
export class Favorites implements OnInit {

    _favorites: Observable<IRestaurant[]>;

    constructor(private config: Configuration, private api: Api, private logger: Logger, private data: RestaurantsData, private navCtrl: NavController) {
    }

    ngOnInit() {
        this.data.Favorites.subscribe(favorites => {
            this._favorites = this.data.Restaurants.map(restaurants => restaurants.filter(restaurant => favorites[restaurant.Id]));
        });
    }

    viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, restaurant);
    }
}
