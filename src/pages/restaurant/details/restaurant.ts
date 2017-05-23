import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { MenuController, NavController, NavParams, Navbar, Searchbar, PopoverController, ViewController } from "ionic-angular";
import { Logger } from "../../../app/helpers/logger";
import { Configuration } from "../../../environments/env.config";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { IRestaurant, ICategoryItem, ICategory } from "../../../contracts";
import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { UI } from "../../../app/helpers/index";
import { orderBy, some } from "lodash";
import { Utils } from "../../../app/helpers/utils";
import { VariationsPopover } from "./variations/variations.popover";
import { BranchRatePopover } from "../branches/rate/rate.popover";
import { BasePage, AppSettings } from "../../../app/infrastructure/index";

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
export class Restaurant extends BasePage implements OnInit {

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
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private renderer: Renderer2, private popoverCtrl: PopoverController, private viewCtrl: ViewController,
        private data: RestaurantsData) {
        super({ config, appSettings, logger });
        this.restaurant = navParams.data.restaurant;
        if (navParams.data.query) {
            this.queryText = navParams.data.query;
            this.query.next(this.queryText);
            this.searchState = "focused";
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
    ngOnInit() {
        // init
    }
    ionViewDidLoad() {
        this.ui.showLoading();
        this.categories = this.data.getRestaurant(this.restaurant.id)
            .do(() => this.ui.hideLoading())
            .combineLatest(this.query.distinctUntilChanged())
            .debounceTime(300)
            .map(([restaurant, query]) => {
                this.restaurant = restaurant;
                // query
                const categories = this.search(Utils.deepClone(restaurant.categories), query);
                // order
                // const orderedCategories = orderBy(categories, (category: ICategory) => category.name[0]);
                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            });
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.viewCtrl.willUnload)
            .subscribe(isFavorite => this.isFavorite = isFavorite);
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
    showVariations(ev, item: ICategoryItem) {
        const popover = this.popoverCtrl.create(VariationsPopover,
            { item },
            { cssClass: "wide-popover" }
        );
        popover.present();
    }
    showBranchRate(ev) {
        const firstTime = true;
        if (firstTime) {
            const popover = this.popoverCtrl.create(BranchRatePopover,
                { branches: this.restaurant.branches },
                { cssClass: "wide-popover" }
            );
            popover.present(); // { ev });
        } else {
            this.ui.showToast("You have already rated this branch!");
        }
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
