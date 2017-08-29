import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import { Logger } from "../../app/helpers/logger";
import { Api } from "../../app/services/api";
import { RestaurantsData } from "../../app/services/data/restaurants.data";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { IRestaurant } from "../../app/contracts/index";
import { BasePage } from "../../app/infrastructure/index";

@Component({
    selector: "page-favorites",
    templateUrl: "favorites.html"
})
export class Favorites extends BasePage {
    public favorites: Observable<IRestaurant[]>;
    constructor(
        private logger: Logger,
        private data: RestaurantsData,
        private navCtrl: NavController) {
        super({ logger });
    }
    public ionViewDidLoad() {
        this.favorites = this.data.Favorites.flatMap(favorites => {
            return this.data.Restaurants.map(restaurants =>
                restaurants.filter(restaurant => favorites[restaurant.id])
            );
        });
    }
    public viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant });
    }
    public viewBranches(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant, tabIndex: 1 });
    }
}
