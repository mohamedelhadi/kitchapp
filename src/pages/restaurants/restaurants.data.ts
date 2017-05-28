import { Injectable } from "@angular/core";
import { Api } from "../../app/services/api";
import { IRestaurant, IFavorites, FAVORITE_RESTAURANTS, ICategory, IVariationRate, IApiOptions, IBranch, IBranchRateSummary, IBranchRate, RESTAURANTS } from "../../contracts";
import { Storage } from "@ionic/storage";

import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";

import * as savedRestaurants from "../../data/restaurants.json";

@Injectable()
export class RestaurantsData {
    private restaurants = new BehaviorSubject<IRestaurant[]>([]);
    private favorites = new BehaviorSubject<IFavorites>({});

    constructor(private api: Api, private storage: Storage) {
        // this._restaurants.startWith([]); // load from storage first, if empty startWith[] (same with _favorites)
        storage.ready().then(() => {
            this.storage.get(RESTAURANTS).then((restaurants: IRestaurant[]) => {
                if (restaurants) {
                    this.restaurants.next(restaurants);
                } else {
                    this.restaurants.next(savedRestaurants);
                }
            });
            this.storage.get(FAVORITE_RESTAURANTS).then((favorites: IFavorites) => {
                if (favorites) {
                    this.favorites.next(favorites);
                }
            });
        });
    }
    get Restaurants() {
        return this.restaurants.asObservable();
    }
    get Favorites() {
        return this.favorites.asObservable();
    }
    getRestaurants(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.restaurants.getValue().length === 0) {
            this.api.get("restaurants/prefetch", options).subscribe((restaurants: IRestaurant[]) => {
                for (const restaurant of restaurants) {
                    if (!restaurant.icon) {
                        restaurant.icon = "assets/images/restaurant.png";
                    }
                }
                this.storage.set(RESTAURANTS, restaurants);
                this.restaurants.next(restaurants);
            });
        }
    }
    getRestaurant(id: number): Observable<IRestaurant> {
        return this.restaurants.map(restaurants => restaurants.find(restaurant => restaurant.id === id));
        // return this.api.get(`restaurants/${id}`);
    }
    isFavorite(restaurant: IRestaurant): Observable<boolean> {
        return this.favorites.map(favorites => favorites[restaurant.id]);
    }
    setFavorite(restaurant: IRestaurant, favorite: boolean) {
        const favorites = this.favorites.getValue();
        favorites[restaurant.id] = favorite;
        this.storage.set(FAVORITE_RESTAURANTS, favorites);
        this.favorites.next(favorites);
    }
    rateVariation(rate: IVariationRate) {
        return this.api.post("restaurants/rate-variation", rate);
    }
    getRestaurantBranches(restaurantId: number): Observable<IBranch[]> {
        return this.getRestaurant(restaurantId).map(restaurant => restaurant.branches);
        // return this.api.get(`branches/restaurantbranches/${restaurantId}`);
    }
    rateBranch(rate: IBranchRate): Observable<IBranchRateSummary> {
        return this.api.post("branches/rate", rate);
    }
    updateStream() {
        this.restaurants.next(this.restaurants.getValue());
    }
    /*getCategories(restaurantId: number): Observable<ICategory[]> {
        return this.api.get(`restaurants/categories/${restaurantId}`);
    }*/
}
