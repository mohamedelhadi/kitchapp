import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController, ViewController } from "ionic-angular";
import { DealsData } from "../../app/services/data/deals.data";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Deal } from "../deal/deal";
import { IRestaurant, IDeal } from "../../app/contracts/index";
import { Logger, UI } from "../../app/helpers/index";
import { BasePage } from "../../app/infrastructure/index";

@Component({
    selector: "page-deals",
    templateUrl: "deals.html"
})
export class Deals extends BasePage {
    public restaurant: IRestaurant;
    public deals: Observable<IDeal[]>;
    constructor(
        private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: DealsData) {
        super({ logger });
        this.restaurant = navParams.data && navParams.data.id ? navParams.data : null;
    }
    public ionViewDidLoad() {
        // TODO: consider adding pull-to-refresh
        this.deals = this.getDeals();
    }
    public getDeals() {
        this.data.getDeals(true, { showLoading: false });
        if (this.restaurant) {
            return this.data.getRestaurantDeals(this.restaurant.id);
        } else {
            return this.data.Deals;
        }
    }
    public viewDeal(deal: IDeal) {
        this.navCtrl.push(Deal, { deal, canNavigateToRestaurant: !this.restaurant });
    }
    public onBackButton() {
        if (this.restaurant) { // coming from restaurant details
            this.navCtrl.parent.select(0);
        } else { // coming from home
            this.navCtrl.canGoBack();
        }
    }
}
