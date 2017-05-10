import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { Configuration } from "../../environments/env.config";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { MenuController, NavController, Searchbar } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { Favorites } from "../favorites/favorites";
import { SplashScreen } from "@ionic-native/splash-screen";

@Component({
    selector: "page-home",
    templateUrl: "home.html",
    animations: [
    ]
})
export class Home {

    query: string = "";

    constructor(private splashScreen: SplashScreen, private config: Configuration, private api: Api, private logger: Logger, private data: RestaurantsData, private menu: MenuController, private navCtrl: NavController) {
        // this.menu.enable(false);
    }

    ionViewDidLoad() {
        this.splashScreen.hide();
    }

    viewRestaurants() {
        this.navCtrl.push(Restaurants);
    }

    viewFavorites() {
        this.navCtrl.push(Favorites);
    }
}
