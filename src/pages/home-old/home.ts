/*import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { Configuration } from "../../environments/env.config";
import { Api } from "../../app/services/api";
import { Logger } from "../../app/helpers/logger";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { MenuController, NavController, Searchbar } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { Favorites } from "../favorites/favorites";
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
    selector: "page-home",
    templateUrl: "home.html",
    animations: [
        trigger("fakeSearchbarTrigger", [
            // state
            state("search-collapsed", style({
                width: "62px"
            })),
            state("search-focused", style({
                width: "100%",
                opacity: 0
            })),
            // transition
            transition("search-collapsed <=> search-focused", animate("300ms ease-out"))
        ]),
        trigger("searchbarTrigger", [
            // state
            state("search-collapsed", style({
                opacity: 0,
                "pointer-events": "none"
            })),
            state("search-focused", style({
                opacity: 1
            })),
            // transition
            transition("search-collapsed => search-focused", animate("500ms ease-in")),
            transition("search-focused => search-collapsed", animate("500ms ease-out"))
        ]),
        trigger("menuBtnTrigger", [
            // state
            state("search-collapsed", style({
                opacity: 1
            })),
            state("search-focused", style({
                opacity: 0,
                "pointer-events": "none"
            })),
            // transition
            transition("search-collapsed => search-focused", animate("300ms ease-out")),
            transition("search-focused => search-collapsed", animate("500ms ease-out"))
        ])
    ]
})
export class Home implements OnInit {

    query: string = "";
    searchState: string = "search-collapsed";
    @ViewChild("searchbar") searchbar: Searchbar;

    constructor(private splashScreen: SplashScreen, private config: Configuration, private api: Api, private logger: Logger, private data: RestaurantsData, private menu: MenuController, private navCtrl: NavController) {
        // this.menu.enable(false);
    }

    focusSearch() {
        this.searchState = "search-focused";
        this.searchbar.setFocus();
    }
    collapseSearch() {
        if (!this.query) {
            this.searchState = "search-collapsed";
            // should hide keyboard if still visible
        }
    }

    ionViewDidLoad() {
        this.splashScreen.hide();
    }

    ngOnInit() {
        this.data.getRestaurants();
        // this.viewRestaurants();
    }

    viewRestaurants() {
        this.navCtrl.push(Restaurants);
    }

    viewFavorites() {
        this.navCtrl.push(Favorites);
    }

    search() {
    }
}
*/