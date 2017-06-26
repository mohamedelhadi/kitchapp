import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { MenuController, NavController, NavParams, Navbar, Searchbar, PopoverController, ViewController } from "ionic-angular";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { UI, Logger, Utils } from "../../../app/helpers/index";
import { orderBy, some } from "lodash";
import { VariationsPopover } from "./variations/variations.popover";
import { BranchRatePopover } from "../branches/rate/rate.popover";
import { BasePage } from "../../../app/infrastructure/index";
import { IRestaurant, ICategory, ICategoryItem } from "../../../app/contracts/index";
import { Auth } from "../../../app/services/index";
import { FeedbackPopover } from "./feedback/feedback.popover";

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
    ]
})
export class Restaurant extends BasePage {

    @ViewChild("navbar") navbar: Navbar;
    @ViewChild("searchbar") searchbar: Searchbar;
    searchState: string = "collapsed";
    // categoryState: string = "collapsed";
    restaurant: IRestaurant;
    isFavorite: boolean;
    rating: number;
    hideBio: boolean = true;
    categories: Observable<ICategory[]>;
    query = new BehaviorSubject<string>("");
    queryText: string;
    noMatchForQuery: boolean;
    isForwardedSearch: boolean;
    constructor(
        private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private renderer: Renderer2, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: RestaurantsData, private auth: Auth) {
        super({ logger });
        this.restaurant = navParams.data.restaurant;
        if (navParams.data.query) {
            this.queryText = navParams.data.query;
            this.query.next(this.queryText);
            this.searchState = "focused";
            this.isForwardedSearch = true;
        }
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
    ionViewDidLoad() {
        this.categories = this.data.getRestaurant(this.restaurant.id)
            .combineLatest(this.query.distinctUntilChanged())
            .debounceTime(300)
            .map(([restaurant, query]) => {
                this.restaurant = restaurant;
                // query
                const categories = this.search(Utils.deepClone(restaurant.categories), query);
                // order
                const orderedCategories = orderBy(categories, (category: ICategory) => category.order);
                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            });
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.viewCtrl.willUnload)
            .subscribe(isFavorite => this.isFavorite = isFavorite);
    }
    search(categories: ICategory[], query: string) {
        if (query && query.trim() !== "") {
            const result = categories.filter(category => {
                query = query.trim().toLowerCase();
                // search in category items names
                category.categoryItems = category.categoryItems.filter(item => {
                    return item.tags.indexOf(query) > -1 || item.name[this.settings.language].toLowerCase().indexOf(query) > -1 || item.name[1].indexOf(query) > -1;
                });
                const foundMatch = category.categoryItems.length > 0;
                if (foundMatch) {
                    category.expanded = true;
                }
                return foundMatch;
            });
            if (result.length === 0 && this.isForwardedSearch) {
                // this case happens when the user search for e.g. restaurant name, or branch name in the list screen
                // there's no such match in category items, thus the reset
                this.searchState = "collapsed";
                this.isForwardedSearch = false;
                this.queryText = "";
                return categories;
            }
            return result;
        }
        return categories;
    }
    onQueryChanged(ev: any) {
        this.query.next(ev.target.value);
    }
    showVariations(ev, item: ICategoryItem) {
        const popover = this.popoverCtrl.create(VariationsPopover,
            { item },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    showBranchRate(ev) {
        this.auth.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                this.showPopover();
            } else {
                this.auth.signInWithFacebook().then(() => {
                    this.showPopover();
                });
            }
        });
    }
    showPopover() {
        const popover = this.popoverCtrl.create(BranchRatePopover,
            { branches: this.restaurant.branches },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    showFeedback(ev) {
        const popover = this.popoverCtrl.create(FeedbackPopover,
            { restaurant: this.restaurant },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    call() {
        this.navCtrl.parent.select(1);
    }
    toggleFavorite() {
        this.data.setFavorite(this.restaurant, !this.isFavorite);
    }
    onBackButton() {
        this.navCtrl.parent.parent.pop();
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
