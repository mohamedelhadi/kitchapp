import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Api } from '../../services';
import {
    IRestaurant, IFavorites, RESTAURANTS, FAVORITE_RESTAURANTS,
    IApiOptions, IVariationRate, IBranch, IBranchRateSummary, IBranchRate, IFeedback
} from '../../contracts';

import { default as bundledRestaurants } from '../../../assets/data/restaurants.json';

@Injectable()
export class RestaurantsData {
    private restaurants = new BehaviorSubject<IRestaurant[]>([]);
    private favorites = new BehaviorSubject<IFavorites>({});

    constructor(private api: Api, private storage: Storage) {
        this.init();
    }
    private async init() {
        const pRestaurants: Promise<IRestaurant[]> = this.storage.get(RESTAURANTS);
        const pFavorites = this.storage.get(FAVORITE_RESTAURANTS);

        this.restaurants.next(await pRestaurants || bundledRestaurants);
        const favorites: IFavorites = await pFavorites;
        if (favorites) {
            this.favorites.next(favorites);
        }
    }
    get restaurants$() {
        return this.restaurants.asObservable();
    }
    get favorites$() {
        return this.favorites.asObservable();
    }
    public getRestaurants(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.restaurants.getValue().length === 0) {
            this.api
                .get('restaurants/prefetch', options)
                .subscribe((restaurants: IRestaurant[]) => {
                    this.storage.set(RESTAURANTS, restaurants);
                    this.restaurants.next(restaurants);
                });
        }
    }
    public getRestaurant(id: number): Observable<IRestaurant> {
        return this.restaurants
            .take(1)
            .map(restaurants => restaurants.find(restaurant => restaurant.id === id));
        // return this.api.get(`restaurants/${id}`);
    }
    public isFavorite(restaurant: IRestaurant): Observable<boolean> {
        return this.favorites.map(favorites => favorites[restaurant.id]);
    }
    public setFavorite(restaurant: IRestaurant, favorite: boolean) {
        const favorites = this.favorites.getValue();
        favorites[restaurant.id] = favorite;
        this.storage.set(FAVORITE_RESTAURANTS, favorites);
        this.favorites.next(favorites);
    }
    public rateVariation(rate: IVariationRate): Observable<number> {
        return this.api.post('restaurants/rate-variation', rate);
    }
    public getRestaurantBranches(restaurantId: number): Observable<IBranch[]> {
        return this.getRestaurant(restaurantId).map(restaurant => restaurant.branches);
        // return this.api.get(`restaurants/${restaurantId}/branches`);
    }
    public rateBranch(rate: IBranchRate): Observable<IBranchRateSummary> {
        return this.api.post('branches/rate', rate);
    }
    public updateStream() {
        this.restaurants.next(this.restaurants.getValue());
    }
    public sendFeedback(feedback: IFeedback) {
        return this.api.post(`restaurants/${feedback.restaurantId}/feedbacks`, feedback);
    }
}
