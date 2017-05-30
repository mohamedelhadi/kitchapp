import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { MenuController, NavController, Searchbar } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { Favorites } from "../favorites/favorites";
import { SplashScreen } from "@ionic-native/splash-screen";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { Cuisines } from "../cuisines/cuisines";
import { Deals } from "../restaurant/deals/deals";
import { AppSettings, BasePage } from "../../app/infrastructure/index";
import { Language } from "../../app/contracts/index";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class Home extends BasePage {
    toggleLanguage: Language;
    constructor(
        private appSettings: AppSettings, private logger: Logger,
        private splashScreen: SplashScreen,
        private restaurantsData: RestaurantsData,
        private menu: MenuController, private navCtrl: NavController) {
        super({ appSettings, logger });
        this.menu.enable(false);
        this.appSettings.Settings.subscribe(settings => {
            this.toggleLanguage = this.settings.language === Language.en ? Language.ar : Language.en;
        });
    }
    ionViewDidLoad() {
        this.splashScreen.hide();
        // this.viewCuisines();
        /*this.restaurantsData.Restaurants.subscribe(restaurants => {
            if (restaurants.length) {
                this.navCtrl.push(RestaurantTabs, restaurants[0]);
            }
        });*/
    }
    toggle() {
        this.appSettings.setLanguage(this.toggleLanguage, this.settings);
    }
    viewRestaurants() {
        this.navCtrl.push(Restaurants);
    }
    viewFavorites() {
        this.navCtrl.push(Favorites);
    }
    viewCuisines() {
        this.navCtrl.push(Cuisines);
    }
    viewDeals() {
        this.navCtrl.push(Deals);
    }
}
