import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { MenuController, NavController, NavParams, Navbar, Searchbar, PopoverController, ViewController, FabContainer } from "ionic-angular";
import { RestaurantsData } from "../../../app/services/data/restaurants.data";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/distinctUntilChanged";
import { UI, Logger, Utils } from "../../../app/helpers/index";
import orderBy from "lodash/orderBy";
import some from "lodash/some";
import cloneDeep from "lodash/cloneDeep";
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
                opacity: 0,
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
    @ViewChild("navbar") public navbar: Navbar;
    @ViewChild("searchbar") public searchbar: Searchbar;
    public searchState: string = "collapsed";
    public restaurant: IRestaurant;
    public isFavorite: boolean;
    public rating: number;
    public hideBio: boolean = true;
    public categories: Observable<ICategory[]>;
    public noMatchForQuery: boolean;
    public queryText: string;
    private query = new BehaviorSubject<string>("");
    private isForwardedSearch: boolean;
    constructor(
        private ui: UI, logger: Logger,
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

    public focusSearchbar() {
        this.searchState = "focused";
        this.searchbar.setFocus();
    }
    public collapseSearchbar() {
        if (!this.query.getValue()) {
            this.searchState = "collapsed";
            // TODO: hide keyboard if still visible
        }
    }
    public ionViewDidLoad() {
        this.ui.showLoading();
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
            })
            .do(() => this.ui.hideLoading());
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.viewCtrl.willUnload)
            .subscribe(isFavorite => this.isFavorite = isFavorite);
    }
    private search(categories: ICategory[], query: string) {
        if (query && query.trim() !== "") {
            const copy = cloneDeep(categories);
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
                // this case occurs when the user searches for e.g. restaurant name, or branch name in the restaurants list screen
                // there's no such match in category items, thus the reset
                this.searchState = "collapsed";
                this.isForwardedSearch = false;
                this.queryText = "";
                return copy;
            }
            return result;
        }
        return categories;
    }
    public onQueryChanged(ev: any) {
        this.query.next(ev.target.value);
    }
    public showVariations(ev, item: ICategoryItem) {
        const popover = this.popoverCtrl.create(
            VariationsPopover,
            { item },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    public async showBranchRate(ev) {
        const loggedIn = await this.auth.isLoggedIn();
        if (loggedIn) {
            this.showPopover();
        } else {
            const successfullyLoggedIn = await this.auth.loginWithFacebook(this.translation.Messages.YouNeedToLoginInOrderToRate);
            if (successfullyLoggedIn) {
                this.showPopover();
            }
        }
    }
    public showPopover() {
        const popover = this.popoverCtrl.create(
            BranchRatePopover,
            { branches: this.restaurant.branches },
            { cssClass: "wide-popover top-popover" }
        );
        popover.present();
    }
    public showFeedback(fab: FabContainer) {
        fab.close();
        const popover = this.popoverCtrl.create(
            FeedbackPopover,
            { restaurant: this.restaurant },
            { cssClass: "wide-popover top-popover" }
        );
        popover.present();
    }
    public call() {
        this.navCtrl.parent.select(1);
    }
    public toggleFavorite(fab: FabContainer) {
        this.data.setFavorite(this.restaurant, !this.isFavorite);
    }
    public onBackButton() {
        this.navCtrl.parent.parent.pop();
    }
    public onScroll(event) {
        event.domWrite(() => {
            const toolbar: Element = this.navbar.getElementRef().nativeElement.getElementsByClassName("toolbar-background")[0];
            const scrollPosition: number = event.scrollTop;
            if (scrollPosition >= 35 && scrollPosition <= 90) {
                // 35 -> 90: start fading in from point 35, should reach full opaque by point 90: 90-35=60 hence 60 steps of opacity transition
                const toolbarOpacity = (scrollPosition - 25) / 60;
                this.setElementOpacity(toolbar, toolbarOpacity);
            } else if (scrollPosition < 35) {
                this.setElementOpacity(toolbar, 0);
            } else if (scrollPosition > 90) {
                this.setElementOpacity(toolbar, 1);
            }
        });
    }
    private setElementOpacity(element: Element, opacity: number) {
        this.renderer.setStyle(element, "opacity", opacity.toString());
    }
    public closeFab(fab: FabContainer) {
        fab.close();
    }
}
