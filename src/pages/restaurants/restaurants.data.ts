import { Injectable } from "@angular/core";
import { Api } from "../../app/services/api";
import { IRestaurant, IFavorites, FAVORITE_RESTAURANTS, ICategory } from "../../contracts";
import { Storage } from "@ionic/storage";

import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";

// import * as tmp from "../../data/restaurants.json";

@Injectable()
export class RestaurantsData {
    private restaurants = new BehaviorSubject<IRestaurant[]>([]);
    private favorites = new BehaviorSubject<IFavorites>({});

    constructor(private api: Api, private storage: Storage) {
        // this._restaurants.startWith([]); // load from storage first, if empty startWith[] (same with _favorites)
        storage.ready().then(() => {
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

    getRestaurants(forceUpdate?: boolean) {
        if (forceUpdate || this.restaurants.getValue().length === 0) {
            this.api.get("restaurants").subscribe((restaurants: IRestaurant[]) => {
                for (const restaurant of restaurants) {
                    if (!restaurant.icon) {
                        // TODO: move below icon assignment in here
                    }
                    restaurant.icon = "assets/images/restaurant.png";
                }
                this.restaurants.next(restaurants);
            });
            /*setTimeout(() => {
                for (const restaurant of tmp) {
                    restaurant.icon = "assets/images/restaurant_placeholder.png";
                }
                this.restaurants.next(tmp);
            }, 0);*/
        }
    }

    /*getCategories(restaurantId: number): Observable<ICategory[]> {
        return this.api.get(`restaurants/categories/${restaurantId}`);
    }*/

    getRestaurant(id: number): Observable<IRestaurant> {
        return this.api.get(`restaurants/${id}`);
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
}
