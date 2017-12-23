import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DealsData } from '../../app/services/data/deals.data';
import { Observable } from 'rxjs/Observable';
import { Deal } from '../deal/deal';
import { IRestaurant, IDeal } from '../../app/contracts/index';
import { BasePage } from '../../app/infrastructure/index';

@Component({
    selector: 'page-deals',
    templateUrl: 'deals.html'
})
export class Deals extends BasePage {
    public restaurant: IRestaurant;
    public deals: Observable<IDeal[]>;
    constructor(
        private navCtrl: NavController, private navParams: NavParams,
        private data: DealsData) {
        super({});
        this.restaurant = navParams.data && navParams.data.id ? navParams.data : null;
    }
    public ionViewDidLoad() {
        // TODO: consider adding pull-to-refresh
        this.deals = this.getDeals();
    }
    public getDeals() {
        this.data.getDeals(true, { handleLoading: false });
        if (this.restaurant) {
            return this.data.getRestaurantDeals(this.restaurant.id);
        } else {
            return this.data.deals$;
        }
    }
    public viewDeal(deal: IDeal) {
        this.navCtrl.push(Deal, { deal, canNavigateToRestaurant: !this.restaurant });
    }
    public onBackButton() {
        if (this.restaurant) { // came to this view from restaurant details
            this.navCtrl.parent.select(0);
        } else { // came from home
            this.navCtrl.canGoBack();
        }
    }
}
