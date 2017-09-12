import { Component } from "@angular/core";
import { NavController, PopoverController, NavParams } from "ionic-angular";
import { RestaurantsData } from "../../app/services/data/restaurants.data";
import { RestaurantsPopover } from "./menu/restaurants.popover";
import orderBy from "lodash/orderBy";
import some from "lodash/some";
import { RestaurantTabs } from "../restaurant/tabs/tabs";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromPromise";
import { BasePage } from "../../app/infrastructure/index";
import { IRestaurant, City, Cuisine, IRestaurantsSearchSettings, ICategory, IDistanceDictionary, InternalError, ErrorCodes, IBranch, Language } from "../../app/contracts/index";
import { Logger, UI, Utils, AppErrorHandler } from "../../app/helpers/index";
import { CitiesData, CuisinesData } from "../../app/services/data/index";

import { default as fuzzysort } from 'fuzzysort';
fuzzysort.highlightMatches = false;

@Component({
    selector: "page-restaurants",
    templateUrl: "restaurants.html"
})
export class Restaurants extends BasePage {
    private none: number = -1;
    private allCities = new City(this.none, ["All", "الكل"]);
    private allCuisines = new Cuisine(this.none, ["All", "الكل"]);
    private searchSettings = new BehaviorSubject<IRestaurantsSearchSettings>({ a_to_z: true, nearby: false, topRated: false, cityId: this.none, cuisineId: this.none });
    private query = new BehaviorSubject<string>("");
    public noMatchForQuery: boolean;
    public restaurants: Observable<IRestaurant[]>;

    constructor(
        private ui: UI, private errHandler: AppErrorHandler, logger: Logger,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        private data: RestaurantsData, private cities: CitiesData, private cuisines: CuisinesData) {
        super({ logger });
        if (navParams.data.cuisineId) {
            const settings = this.searchSettings.getValue();
            settings.cuisineId = navParams.data.cuisineId;
            this.searchSettings.next(settings);
        }
    }
    private optimizeForSearch(restaurants: IRestaurant[]) {
        restaurants = Utils.deepClone(restaurants);
        for (const restaurant of restaurants) {
            restaurant.preparedName = fuzzysort.prepare(restaurant.name.toString());
            restaurant.preparedTags = fuzzysort.prepare(restaurant.tags);

            const categoryItemsNames = restaurant.categories.map(category => category.categoryItems.map(categoryItem => categoryItem.name.toString()).toString()).toString();
            restaurant.preparedItemsNames = fuzzysort.prepare(categoryItemsNames);

            const categoryItemsTags = restaurant.categories.map(category => category.categoryItems.map(categoryItem => categoryItem.tags).toString()).toString();
            restaurant.preparedItemsTags = fuzzysort.prepare(categoryItemsTags);

            const branchesNames = restaurant.branches.map(branch => branch.location.address.toString()).toString();
            restaurant.preparedBranchesNames = fuzzysort.prepare(branchesNames);
        }
        return restaurants;
    }
    public ionViewDidLoad() {
        this.data.getRestaurants();
        this.ui.showLoading();
        this.restaurants = this.data.restaurants$
            .map(this.optimizeForSearch)
            .combineLatest(this.query.distinctUntilChanged(), this.searchSettings.startWith())
            .debounceTime(300)
            .flatMap(([restaurants, query, settings]) => {
                // filter
                restaurants = this.filter(restaurants, settings);
                // query
                restaurants = this.search(restaurants, query);
                // order
                const orderedRestaurants = this.orderRestaurants(restaurants, settings);
                // settings.cityId is being passed as a string from ion-select (potentially ngFor/ngModel bug)
                this.noMatchForQuery = restaurants.length === 0 && (query || +settings.cityId !== this.none || settings.cuisineId !== +this.none) as any;
                return orderedRestaurants;
            })
            .do(() => this.ui.hideLoading());
    }
    public viewRestaurant(restaurant: IRestaurant) {
        this.navCtrl.push(RestaurantTabs, { restaurant, query: this.query.getValue() });
    }
    public onQueryChanged(ev: any) {
        this.query.next(ev.target.value);
    }
    public showPopover(ev) {
        const popover = this.popoverCtrl.create(RestaurantsPopover, {
            settings: this.searchSettings,
            cities: this.cities.cities$.map(cities => [this.allCities].concat(cities)),
            cuisines: this.cuisines.cuisines$.map(cuisines => [this.allCuisines].concat(cuisines))
        });
        popover.present({ ev });
    }
    private filter(restaurants: IRestaurant[], settings: IRestaurantsSearchSettings) {
        // settings.cityId is being passed as a string from ion-select (potentially ngFor/ngModel bug)
        if (settings.cityId && +settings.cityId !== this.none) {
            restaurants = restaurants.filter(restaurant => {
                return some(restaurant.branches, branch => branch.location.cityId === +settings.cityId);
            });
        }
        if (settings.cuisineId && +settings.cuisineId !== this.none) {
            restaurants = restaurants.filter(restaurant => {
                return some(restaurant.cuisineIds, cuisineId => cuisineId === +settings.cuisineId);
            });
        }
        return restaurants;
    }
    private search(restaurants: IRestaurant[], query: string) {
        if (query && query.trim() !== "") {
            query = query.trim().toLowerCase();

            const results = [];
            for (const restaurant of restaurants) {
                const nameInfo = fuzzysort.single(query, restaurant.preparedName);
                const tagsInfo = fuzzysort.single(query, restaurant.preparedTags);
                const itemsNamesInfo = fuzzysort.single(query, restaurant.preparedItemsNames);
                const itemsTagsInfo = fuzzysort.single(query, restaurant.preparedItemsTags);
                const branchesNamesInfo = fuzzysort.single(query, restaurant.preparedBranchesNames);

                // Create a custom combined score to sort by. +200 to the items' tags score makes it a worse match
                const minimumScore = Math.min(
                    nameInfo ? nameInfo.score : 1000,
                    tagsInfo ? tagsInfo.score + 100 : 1000,
                    itemsNamesInfo ? itemsNamesInfo.score + 100 : 1000,
                    itemsTagsInfo ? itemsTagsInfo.score + 200 : 1000,
                    branchesNamesInfo ? branchesNamesInfo.score + 100 : 1000
                );
                if (minimumScore >= 1000) { continue; }

                results.push({
                    restaurant,
                    minimumScore
                });
            }
            // results.sort((a, b) => a.minimumScore - b.minimumScore);
            return results.map(result => result.restaurant);

            /* return restaurants.filter(restaurant => {
                query = query.trim().toLowerCase();
                // search in restaurant name
                const matchesRestaurantName = restaurant.name[this.settings.language].toLowerCase().indexOf(query) > -1 || restaurant.name[1].indexOf(query) > -1;
                if (matchesRestaurantName) {
                    return true;
                }
                // search in restaurant tags
                const matchesRestaurantTags = restaurant.tags.indexOf(query) > -1;
                if (matchesRestaurantTags) {
                    return true;
                }
                // search in category items names
                const matchesItemName = some(restaurant.categories, (category: ICategory) => {
                    return some(category.categoryItems, item => {
                        return item.tags.indexOf(query) > -1 || item.name[this.settings.language].toLowerCase().indexOf(query) > -1 || item.name[1].indexOf(query) > -1;
                    });
                });
                if (matchesItemName) {
                    return true;
                }
                // search in branches address
                const matchesBranchAddress = some(restaurant.branches, branch => branch.location.address[0].toLowerCase().indexOf(query) > -1 || branch.location.address[1].indexOf(query) > -1);
                if (matchesBranchAddress) {
                    return true;
                }
                return false;
            }); */
        }
        return restaurants;
    }
    private orderRestaurants(restaurants: IRestaurant[], settings: IRestaurantsSearchSettings): Observable<IRestaurant[]> {
        if (restaurants.length === 0) {
            return Observable.of([]);
        }
        // alphabetical
        const order = settings.a_to_z ? "asc" : "desc";
        restaurants = orderBy(restaurants, (restaurant: IRestaurant) => restaurant.name[this.settings.language], [order]);
        // top rated
        if (settings.topRated) {
            restaurants = orderBy(restaurants, (restaurant: IRestaurant) => restaurant.branches[0].rate.overall, ["desc"]);
        }
        // nearby
        if (settings.nearby) {
            return Observable.fromPromise(this.orderByNearest(restaurants));
        }
        return Observable.of(restaurants);
    }
    private orderByNearest(restaurants: IRestaurant[]) {
        return new Promise((resolve, reject) => {
            this.ui.showLoading(this.translation.Messages.LoadingPosition, false);
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const distances: IDistanceDictionary = {};
                    for (const r of restaurants) {
                        const distance = this.getDistanceFromClosestBranch(latitude, longitude, r.branches);
                        distances[r.id] = distance;
                    }
                    restaurants = orderBy(restaurants, r => {
                        return distances[r.id];
                    });
                    this.ui.hideLoading();
                    resolve(restaurants);
                },
                err => {
                    // GPS is off, user didn't give permission, or failed to get position
                    this.errHandler.handleError(new InternalError("Couldn't retrieve coordinates " + (err.message || err.toString()), ErrorCodes.GeolocationPositionError, true, err));
                    this.searchSettings.getValue().nearby = false;
                    this.ui.hideLoading();
                    resolve(restaurants); // to keep chain from breaking and apply other order settings
                },
                { maximumAge: 10000, timeout: 15000 }
            );
        });
    }
    private getDistanceFromClosestBranch(latitude: number, longitude: number, branches: IBranch[]) {
        let closestDistance = 99999999;
        for (const branch of branches) {
            const distance: number = Utils.getDistance(latitude, longitude, branch.location.latitude, branch.location.longitude);
            if (distance < closestDistance) {
                closestDistance = distance;
            }
        }
        return closestDistance;
    }
}
