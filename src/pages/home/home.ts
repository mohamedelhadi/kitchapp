import { Component } from "@angular/core";
import { Logger } from "../../app/helpers/logger";
import { RestaurantsData } from "../../app/services/data/restaurants.data";
import { MenuController, NavController, PopoverController } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { Favorites } from "../favorites/favorites";
import { SplashScreen } from "@ionic-native/splash-screen";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { Cuisines } from "../cuisines/cuisines";
import { BasePage } from "../../app/infrastructure/index";
import { HomePopover } from "./popover/popover";
import { TranslateService } from "@ngx-translate/core";
import { Deals } from "../deals/deals";
import orderBy from "lodash/orderBy";
import some from "lodash/some";

import { IRestaurant, IDistanceDictionary, InternalError, ErrorCodes, IBranch, TranslationKeys } from "../../app/contracts/index";
import { UI, Utils, AppErrorHandler } from "../../app/helpers/index";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class Home extends BasePage {
    private restaurants: IRestaurant[] = [];
    constructor(
        private ui: UI, private errHandler: AppErrorHandler, logger: Logger,
        private splashScreen: SplashScreen,
        private restaurantsData: RestaurantsData,
        private menu: MenuController, private navCtrl: NavController, private popoverCtrl: PopoverController,
        private translate: TranslateService) {
        super({ logger });
        this.menu.enable(false);
    }
    public ionViewDidLoad() {
        // hide the splash only when the determined language has been applied
        this.translate.onLangChange.take(1).subscribe(() => this.splashScreen.hide());
        this.restaurantsData.restaurants$.subscribe(restaurants => this.restaurants = restaurants);
    }
    public viewRestaurants() {
        this.navCtrl.push(Restaurants);
    }
    public viewFavorites() {
        this.navCtrl.push(Favorites);
    }
    public viewCuisines() {
        this.navCtrl.push(Cuisines);
    }
    public viewDeals() {
        this.navCtrl.push(Deals);
    }
    public showPopover(ev) {
        const popover = this.popoverCtrl.create(HomePopover, {}, { cssClass: "narrow-popover" });
        popover.present({ ev });
    }
    public async showMenu() {
        if (this.settings.firstLaunch) {
            // display a popover illustrating that this is a quick shortcut to the nearest restaurant
        }
        const orderedRestaurants: IRestaurant[] = await this.orderByNearest(this.restaurants);
        this.navCtrl.push(RestaurantTabs, { restaurant: orderedRestaurants[0], tabIndex: 0 });
    }
    private orderByNearest(restaurants: IRestaurant[]): Promise<IRestaurant[]> {
        return new Promise((resolve, reject) => {
            this.ui.showLoading(this.translation.Messages.LoadingPosition, false);
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const distances: IDistanceDictionary = {};
                    for (const r of restaurants) {
                        const distance = this.getDistanceFromClosestBranch(latitude, longitude, r.branches);
                        distances[r.id] = distance;
                    }
                    restaurants = orderBy(restaurants, r => distances[r.id]);
                    this.ui.hideLoading();
                    resolve(restaurants);
                },
                err => {
                    // GPS is off, user didn't give permission, or failed to get position
                    this.errHandler.handleError(new InternalError("Couldn't retrieve coordinates " + (err.message || err.toString()), ErrorCodes.GeolocationPositionError, true, err));
                    this.ui.hideLoading();
                },
                { maximumAge: 5000, timeout: 15000, enableHighAccuracy: true }
            );
        });
    }
    private getDistanceFromClosestBranch(latitude: number, longitude: number, branches: IBranch[]) {
        let closestDistance = 99999999;
        for (const branch of branches) {
            const distance: number = Utils.getDistance(latitude, longitude, branch.location.latitude, branch.location.longitude);
            if (distance < closestDistance) {
                closestDistance = distance;
            }
        }
        return closestDistance;
    }
}
