import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { BasePage } from "../../";
import { Configuration } from "../../../environments/env.config";
import { AppSettings } from "../../../app/services/";
import { Logger, UI } from "../../../app/helpers/";
import { DealsData } from "./deals.data";
import { IRestaurant, IDeal } from "../../../contracts/";
import { Subject } from "rxjs/Subject";

@Component({
    selector: "page-deals",
    templateUrl: "deals.html"
})
export class Deals extends BasePage {
    restaurant: IRestaurant;
    deals: IDeal[];
    leavingTab = new Subject(); // because navCtrl.willLeave event doesn't fire for tabs
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        private data: DealsData) {
        super(config, appSettings, logger);
        this.restaurant = navParams.data;
        // TODO: consider adding pull-to-refresh
    }
    ionViewDidLoad() {
        this.ui.showLoading();
        this.getDeals()
            .do(() => this.ui.hideLoading())
            .subscribe(deals => {
                this.deals = deals;
            });
    }
    getDeals() {
        if (this.restaurant) {
            return this.data.getRestaurantDeals(this.restaurant.id);
        } else {
            this.data.getDeals();
            return this.data.Deals;
        }
    }
    back() {
        this.navCtrl.parent.select(0); // this.navCtrl.parent.parent.pop(); switch to first tab because it feels natural
        this.leavingTab.next();
    }
}
