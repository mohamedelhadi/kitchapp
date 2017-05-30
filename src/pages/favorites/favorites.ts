import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Logger } from "../../app/helpers/logger";
import { Api } from "../../app/services/api";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { IRestaurant } from "../../app/contracts/index";
import { AppSettings, BasePage } from "../../app/infrastructure/index";

@Component({
    selector: "page-favorites",
    templateUrl: "favorites.html"
})
export class Favorites extends BasePage {
    favorites: Observable<IRestaurant[]>;
    constructor(
        private appSettings: AppSettings, private logger: Logger,
        private data: RestaurantsData,
        private navCtrl: NavController) {
        super({ appSettings, logger });
    }
    ionViewDidLoad() {
        /* subscriptions aren't disposed
        this.data.Favorites.subscribe(favorites => {
            this.favorites = this.data.Restaurants.map(restaurants => restaurants.filter(restaurant => favorites[restaurant.id]));
        });*/
        this.favorites = this.data.Favorites.flatMap(favorites => {
            return this.data.Restaurants.map(restaurants =>
                restaurants.filter(restaurant => favorites[restaurant.id])
            );
        });
    }
    viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant });
    }
    viewBranches(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant, tabIndex: 1 });
    }
}
