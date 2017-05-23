import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController, ViewController } from "ionic-angular";
import { Configuration } from "../../../environments/env.config";
import { Logger, UI } from "../../../app/helpers/";
import { DealsData } from "./deals.data";
import { IRestaurant, IDeal } from "../../../contracts/";
import { Subject } from "rxjs/Subject";
import { has } from "lodash";
import { BasePage, AppSettings } from "../../../app/infrastructure/index";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "page-deals",
    templateUrl: "deals.html"
})
export class Deals extends BasePage {
    restaurant: IRestaurant;
    deals: Observable<IDeal[]>;
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: DealsData) {
        super({ config, appSettings, logger });
        this.restaurant = navParams.data && has(navParams.data, "id") ? navParams.data : null;
        // TODO: consider adding pull-to-refresh
    }
    ionViewDidLoad() {
        this.ui.showLoading();
        this.deals = this.getDeals().do(() => this.ui.hideLoading());
    }
    getDeals() {
        if (this.restaurant) {
            return this.data.getRestaurantDeals(this.restaurant.id);
        } else {
            this.data.getDeals();
            return this.data.Deals;
        }
    }
    onBackButton() {
        if (this.restaurant) { // coming from restaurant details
            this.navCtrl.parent.select(0);
        } else { // coming from home
            this.navCtrl.canGoBack();
        }
    }
}
