import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { RestaurantsData } from '../../app/services/data/restaurants.data';
import { RestaurantTabs } from '../restaurant/tabs/tabs';
import { IRestaurant } from '../../app/contracts/index';
import { BasePage } from '../../app/infrastructure/index';

@Component({
    selector: 'page-favorites',
    templateUrl: 'favorites.html'
})
export class Favorites extends BasePage {
    public favorites: Observable<IRestaurant[]>;
    constructor(
        private data: RestaurantsData,
        private navCtrl: NavController) {
        super({});
    }
    public ionViewDidLoad() {
        this.favorites = this.data.favorites$.flatMap(favorites => {
            return this.data.restaurants$.map(restaurants =>
                restaurants.filter(restaurant => favorites[restaurant.id])
            );
        });
    }
    public viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant });
    }
    public viewBranches(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant, tabIndex: 1 });
    }
}
