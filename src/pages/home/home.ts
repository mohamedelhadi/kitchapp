import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { MenuController, NavController, Searchbar, PopoverController } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { Favorites } from "../favorites/favorites";
import { SplashScreen } from "@ionic-native/splash-screen";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { Cuisines } from "../cuisines/cuisines";
import { AppSettings, BasePage, onLanguageApplied } from "../../app/infrastructure/index";
import { HomePopover } from "./popover/popover";
import { TranslateService } from "@ngx-translate/core";
import { Deals } from "../deals/deals";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class Home extends BasePage {
    constructor(
        private appSettings: AppSettings, private logger: Logger,
        private splashScreen: SplashScreen,
        private restaurantsData: RestaurantsData,
        private menu: MenuController, private navCtrl: NavController, private popoverCtrl: PopoverController,
        private translate: TranslateService) {
        super({ logger });
        this.menu.enable(false);
    }
    ionViewDidLoad() {
        onLanguageApplied.first().subscribe(() => {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 600);
        });
        // this.viewCuisines();
        /*this.restaurantsData.Restaurants.subscribe(restaurants => {
            if (restaurants.length) {
                this.navCtrl.push(RestaurantTabs, restaurants[0]);
            }
        });*/
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
    showPopover(ev) {
        const popover = this.popoverCtrl.create(HomePopover, {}, { cssClass: "narrow-popover" });
        popover.present({ ev });
    }
}
