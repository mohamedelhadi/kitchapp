import { Injectable } from "@angular/core";
import { Api } from "../../app/services/api";
import { IRestaurant, IFavorites } from "../../contracts";
import { Storage } from "@ionic/storage";

import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";

export const FAVORITE_RESTAURANTS = "FAVORITE_RESTAURANTS";

@Injectable()
export class RestaurantsData {

    // private _restaurants = new Subject<IRestaurant[]>();
    // private _restaurants: Observable<IRestaurant[]> = Observable.from([]);
    private _restaurants = new BehaviorSubject<IRestaurant[]>([]);
    private _favorites = new BehaviorSubject<IFavorites>({});

    constructor(private api: Api, private storage: Storage) {
        // this._restaurants.startWith([]); // load from storage first, if empty startWith[] (same with _favorites)
        storage.ready().then(() => {
            this.storage.get(FAVORITE_RESTAURANTS).then((favorites: IFavorites) => {
                if (favorites) {
                    this._favorites.next(favorites);
                }
            });
        });
    }

    get Restaurants() {
        return this._restaurants.asObservable();
    }

    get Favorites() {
        return this._favorites.asObservable();
    }

    getRestaurants(forceUpdate?: boolean) {
        if (forceUpdate || this._restaurants.isEmpty()) {
            this.api.get("restaurants.json").subscribe((restaurants: IRestaurant[]) => {
                this._restaurants.next(restaurants);
            });

            /*setTimeout(() => {
                this._restaurants.next(this.tmp);
            }, 0);*/
        }
    }

    isFavorite(restaurant: IRestaurant): Observable<boolean> {
        return this._favorites.map(favorites => favorites[restaurant.Id]);
    }

    setFavorite(restaurant: IRestaurant, favorite: boolean) {
        const favorites = this._favorites.getValue();
        favorites[restaurant.Id] = favorite;
        this.storage.set(FAVORITE_RESTAURANTS, favorites);
        this._favorites.next(favorites);
    }
}
