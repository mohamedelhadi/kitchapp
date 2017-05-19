﻿import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { MenuController, NavController, NavParams, Navbar, Searchbar } from "ionic-angular";
import { Logger } from "../../../app/helpers/logger";
import { Configuration } from "../../../environments/env.config";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { IRestaurant, ICategoryItem, ICategory } from "../../../contracts";
import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../../../app/services/index";
import { BasePage } from "../../index";
import { UI } from "../../../app/helpers/index";
import { orderBy, some } from "lodash";
import { Utils } from "../../../app/helpers/utils";

@Component({
    selector: "page-restaurant",
    templateUrl: "restaurant.html",
    animations: [
        trigger("searchbarSpriteState", [
            state("collapsed", style({
                width: "45px"
            })),
            state("focused", style({
                width: "100%",
                opacity: 0
            })),
            transition("collapsed <=> focused", animate("250ms ease-out"))
        ]),
        trigger("searchbarState", [
            state("collapsed", style({
                "opacity": 0,
                "pointer-events": "none"
            })),
            state("focused", style({
                opacity: 1
            })),
            transition("collapsed => focused", animate("550ms ease-in")),
            transition("focused => collapsed", animate("500ms ease-out"))
        ])
        /*trigger("categoryState", [
            state("collapsed", style({
                transform: "scaleY(0)"
            })),
            state("expanded", style({
                transform: "scaleY(1)"
            })),
            transition("collapsed => expanded", animate("550ms ease-in")),
            transition("expanded => collapsed", animate("500ms ease-out"))
        ])
        trigger("menuBtnTrigger", [
            // state
            state("collapsed", style({
                opacity: 1
            })),
            state("focused", style({
                opacity: 0,
                "pointer-events": "none"
            })),
            // transition
            transition("collapsed => focused", animate("300ms ease-out")),
            transition("focused => collapsed", animate("500ms ease-out"))
        ])*/
    ]
})
export class Restaurant extends BasePage implements OnInit {

    @ViewChild("navbar") navbar: Navbar;
    @ViewChild("searchbar") searchbar: Searchbar;
    searchState: string = "collapsed";
    // categoryState: string = "collapsed";
    restaurant: IRestaurant;
    isFavorite: boolean;
    rating: number;
    hideBio: boolean = true;
    allCategories = new Subject<ICategory[]>();
    categories: Observable<ICategory[]>;
    query = new BehaviorSubject<string>("");
    noMatchForQuery: boolean;
    leavingTab = new Subject(); // because navCtrl.willLeave event doesn't fire for tabs
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private renderer: Renderer2,
        private data: RestaurantsData) {
        super(config, appSettings, logger);
        this.restaurant = navParams.data;
        this.rating = this.restaurant.branches[0].rate.overall;
    }

    focusSearchbar() {
        this.searchState = "focused";
        this.searchbar.setFocus();
    }
    collapseSearchbar() {
        if (!this.query.getValue()) {
            this.searchState = "collapsed";
            // TODO: hide keyboard if still visible
        }
    }
    ngOnInit() {
        // init
    }
    ionViewDidLoad() {
        this.ui.showLoading();
        this.categories = this.data.getRestaurant(this.restaurant.id)
            .do(() => this.ui.hideLoading())
            .combineLatest(this.query.startWith("").distinctUntilChanged())
            .debounceTime(300)
            .map(([restaurant, query]) => {
                this.restaurant = restaurant;

                console.time("timerName");
                // query
                const categories = this.search(Utils.deepClone(restaurant.categories), query);
                // order
                // const orderedCategories = orderBy(categories, (category: ICategory) => category.name[0]);
                console.timeEnd("timerName");

                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            });
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.navCtrl.viewWillLeave.merge(this.leavingTab))
            .subscribe(isFavorite => this.isFavorite = isFavorite);

        /*this.data.getRestaurant(this.restaurant.id)
            .subscribe(restaurant => {
                this.ui.hideLoading();
                this.restaurant = restaurant;
                this.allCategories.next(restaurant.categories);
            });
        this.categories = this.allCategories
            .combineLatest(this.query.startWith("").distinctUntilChanged())
            .debounceTime(300)
            .map(([categories, query]) => {
                console.time("timerName");
                // query
                categories = this.search(cloneDeep(categories), query);
                // order
                // const orderedCategories = orderBy(categories, (category: ICategory) => category.name[0]);
                console.timeEnd("timerName");

                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            });*/
        /*this.categories = Observable.of(this.restaurant.categories) // this.data.getCategories(this.restaurant.id)
            .combineLatest(this.query.startWith("").distinctUntilChanged())
            .debounceTime(300)
            .map(([categories, query]) => {
                console.time("timerName");

                // query
                categories = this.search(categories, query);
                // order
                // const orderedCategories = orderBy(categories, (category: ICategory) => category.name[0]);

                console.timeEnd("timerName");
                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            });*/
        // .subscribe(restaurant => this.restaurant = restaurant);
    }
    search(categories: ICategory[], query: string) {
        if (query && query.trim() !== "") {
            return categories.filter(category => {
                query = query.trim().toLowerCase();
                // search in category items names
                category.categoryItems = category.categoryItems.filter(item => {
                    return item.tags.indexOf(query) > -1 || item.name[0].toLowerCase().indexOf(query) > -1 || item.name[1].indexOf(query) > -1;
                });
                const foundMatch = category.categoryItems.length > 0;
                if (foundMatch) {
                    category.expanded = true;
                }
                return foundMatch;
            });
        }
        return categories;
    }
    onQueryChanged(ev: any) {
        this.query.next(ev.target.value);
    }
    call() {
        this.navCtrl.parent.select(1);
    }
    toggleFavorite() {
        this.data.setFavorite(this.restaurant, !this.isFavorite);
    }
    onRateChange($event) {
        // rate change
    }
    back() {
        this.navCtrl.parent.parent.pop();
        this.leavingTab.next();
    }
    onScroll(event) {
        event.domWrite(() => {
            const toolbar: Element = this.navbar.getElementRef().nativeElement.getElementsByClassName("toolbar-background")[0];
            const scrollPosition: number = event.scrollTop;
            if (scrollPosition >= 35 && scrollPosition <= 90) {
                // 55 -> 90: start fade in from point 55, should reach full opaque by point 90: 90-55=35 hence 35 steps of opacity transition
                const toolbarOpacity = (scrollPosition - 25) / 60;
                this.setElementOpacity(toolbar, toolbarOpacity);
            } else if (scrollPosition < 35) {
                this.setElementOpacity(toolbar, 0);
            } else if (scrollPosition > 90) {
                this.setElementOpacity(toolbar, 1);
            }
        });
    }
    setElementOpacity(element: Element, opacity: number) {
        this.renderer.setStyle(element, "opacity", opacity.toString());
    }
}

/* native map: slow and doesn't work when embedded in the page
    let map = new GoogleMap(this.map.nativeElement);
    let coordinates: GoogleMapsLatLng = new GoogleMapsLatLng(parseInt(this._restaurant.Location.Latitude), parseInt(this._restaurant.Location.Longitude));
    let position: CameraPosition = {
        target: coordinates,
        zoom: 18,
        tilt: 30
    };

    map.one(GoogleMapsEvent.MAP_READY).then(() => {
        map.moveCamera(position); // works on iOS and Android
    });

    let markerOptions: GoogleMapsMarkerOptions = {
        position: coordinates,
        title: this._restaurant.Name
    };
    map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
            marker.showInfoWindow();
        });*/
