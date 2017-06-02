import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController, ViewController } from "ionic-angular";
import { DealsData } from "./deals.data";
import { Subject } from "rxjs/Subject";
import { has } from "lodash";
import { BasePage } from "../../../app/infrastructure/index";
import { Observable } from "rxjs/Observable";
import { IRestaurant, IDeal } from "../../../app/contracts/index";
import { Logger, UI } from "../../../app/helpers/index";

@Component({
    selector: "page-deals",
    templateUrl: "deals.html"
})
export class Deals extends BasePage {
    restaurant: IRestaurant;
    deals: Observable<IDeal[]>;
    dealsList: IDeal[];
    constructor(
        private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: DealsData) {
        super({ logger });
        this.restaurant = navParams.data && has(navParams.data, "id") ? navParams.data : null;
    }
    ionViewDidLoad() {
        // TODO: consider adding pull-to-refresh
        this.deals = this.getDeals().do((deals) => {
            this.dealsList = deals;
        });
    }
    getDeals() {
        this.data.getDeals(true);
        if (this.restaurant) {
            return this.data.getRestaurantDeals(this.restaurant.id);
        } else {
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
