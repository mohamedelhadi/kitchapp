import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestaurantsData } from '../../app/services/data/restaurants.data';
import { RestaurantTabs } from '../restaurant/tabs/tabs';
import { IRestaurant, IDeal } from '../../app/contracts/index';
import { BasePage } from '../../app/infrastructure/index';

@Component({
    selector: 'page-deal',
    templateUrl: 'deal.html'
})
export class Deal extends BasePage {
    public deal: IDeal;
    public restaurant: IRestaurant;
    public canNavigateToRestaurant: boolean;
    constructor(
        private navCtrl: NavController, private navParams: NavParams,
        private restaurantsData: RestaurantsData) {
        super({});
        this.deal = navParams.data.deal;
        this.canNavigateToRestaurant = navParams.data.canNavigateToRestaurant;
    }
    public ionViewDidLoad() {
        this.restaurantsData
            .getRestaurant(this.deal.restaurantId)
            .subscribe(restaurant => this.restaurant = restaurant);
    }
    public viewRestaurant() {
        this.navCtrl.push(RestaurantTabs, { restaurant: this.restaurant });
    }
}
