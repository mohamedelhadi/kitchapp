import { Component, Renderer2, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {
    NavController, NavParams, Navbar, Searchbar, PopoverController, ViewController, FabContainer
} from 'ionic-angular';
import { RestaurantsData } from '../../../app/services/data/restaurants.data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/distinctUntilChanged';
import { UI, Logger, Utils } from '../../../app/helpers/index';
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import { VariationsPopover } from './variations/variations.popover';
import { BranchRatePopover } from '../branches/rate/rate.popover';
import { BasePage } from '../../../app/infrastructure/index';
import { IRestaurant, ICategory, ICategoryItem } from '../../../app/contracts/index';
import { Auth } from '../../../app/services/index';
import { FeedbackPopover } from './feedback/feedback.popover';

import { default as fuzzysort } from 'fuzzysort';

@Component({
    selector: 'page-restaurant',
    templateUrl: 'restaurant.html',
    animations: [
        trigger('searchbarSpriteState', [
            state('collapsed', style({
                width: '45px'
            })),
            state('focused', style({
                width: '100%',
                opacity: 0
            })),
            transition('collapsed <=> focused', animate('250ms ease-out'))
        ]),
        trigger('searchbarState', [
            state('collapsed', style({
                opacity: 0,
                'pointer-events': 'none'
            })),
            state('focused', style({
                opacity: 1
            })),
            transition('collapsed => focused', animate('550ms ease-in')),
            transition('focused => collapsed', animate('500ms ease-out'))
        ])
    ]
})
export class Restaurant extends BasePage {
    @ViewChild('navbar') public navbar: Navbar;
    @ViewChild('searchbar') public searchbar: Searchbar;
    public searchState: string = 'collapsed';
    public restaurant: IRestaurant;
    public isFavorite: boolean;
    public rating: number;
    public hideBio: boolean = true;
    public categories: Observable<ICategory[]>;
    public noMatchForQuery: boolean;
    public queryText: string;
    private query = new BehaviorSubject<string>('');
    private isForwardedSearch: boolean;
    constructor(
        private ui: UI, logger: Logger,
        private navCtrl: NavController, private navParams: NavParams,
        private renderer: Renderer2, private popoverCtrl: PopoverController,
        private viewCtrl: ViewController, private browser: InAppBrowser,
        private data: RestaurantsData, private auth: Auth) {
        super({ logger });
        this.restaurant = navParams.data.restaurant;
        if (navParams.data.query) {
            this.queryText = navParams.data.query;
            this.query.next(this.queryText);
            this.searchState = 'focused';
            this.isForwardedSearch = true;
        }
        /* the first branch is the main branch
        use its rate as an overall representation of the restaurant's rating */
        this.rating = this.restaurant.branches[0].rate.overall;
    }
    public focusSearchbar() {
        this.searchState = 'focused';
        this.searchbar.setFocus();
    }
    public collapseSearchbar() {
        if (!this.query.getValue()) {
            this.searchState = 'collapsed';
            // TODO: hide keyboard if it's still visible
        }
    }
    public ionViewDidLoad() {
        this.ui.showLoading();
        this.categories = this.data.getRestaurant(this.restaurant.id)
            .map(restaurant => {
                restaurant = this.optimizeForSearch(restaurant);
                restaurant.categories = orderBy(
                    restaurant.categories,
                    (category: ICategory) => category.order
                );
                return restaurant;
            })
            .combineLatest(this.query.distinctUntilChanged())
            .debounceTime(300)
            .map(([restaurant, query]) => {
                this.restaurant = restaurant;
                // query
                const categories = this.search(Utils.deepClone(restaurant.categories), query)
                    || restaurant.categories;
                this.noMatchForQuery = query && categories.length === 0;
                return categories;
            })
            .do(() => this.ui.hideLoading());
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.pageUnload)
            .subscribe(isFavorite => this.isFavorite = isFavorite);
    }
    private optimizeForSearch(restaurant: IRestaurant) {
        restaurant = Utils.deepClone(restaurant);
        for (const category of restaurant.categories) {
            for (const item of category.categoryItems) {
                item.preparedName = fuzzysort.prepare(item.name.toString());
                item.preparedTags = fuzzysort.prepare(item.tags);
            }
        }
        return restaurant;
    }
    private search(categories: ICategory[], query: string) {
        if (query && query.trim() !== '') {
            query = query.trim().toLowerCase();
            const searchResult = categories.filter(category => {
                // search in category items names
                category.categoryItems = category.categoryItems.filter(item => {
                    const nameInfo = fuzzysort.single(query, item.preparedName);
                    const tagsInfo = fuzzysort.single(query, item.preparedTags);
                    return Math.max(
                        nameInfo ? nameInfo.score : -1000,
                        tagsInfo ? tagsInfo.score - 100 : -1000) > -1000;
                });
                const foundMatch = category.categoryItems.length > 0;
                category.expanded = foundMatch;
                return foundMatch;
            });

            if (searchResult.length === 0 && this.isForwardedSearch) {
                /* this case occurs when the user searches for
                e.g. restaurant name, or branch name in the restaurants list screen
                there's no such match in category items, thus the reset below */
                this.searchState = 'collapsed';
                this.isForwardedSearch = false;
                this.queryText = '';
                return null;
            }
            return searchResult;
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
            { cssClass: 'wide-popover' }
        );
        popover.present();
    }
    public async showBranchRate(ev) {
        const loggedIn = await this.auth.isLoggedIn();
        if (loggedIn) {
            this.showPopover();
        } else {
            const successfullyLoggedIn = await this.auth.loginWithFacebook(
                this.translation.Messages.YouNeedToLoginInOrderToRate
            );
            if (successfullyLoggedIn) {
                this.showPopover();
            }
        }
    }
    public showPopover() {
        const popover = this.popoverCtrl.create(
            BranchRatePopover,
            { branches: this.restaurant.branches },
            { cssClass: 'wide-popover top-popover' }
        );
        popover.present();
    }
    public showFeedback(fab: FabContainer) {
        fab.close();
        const popover = this.popoverCtrl.create(
            FeedbackPopover,
            { restaurant: this.restaurant },
            { cssClass: 'wide-popover top-popover' }
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
            const toolbar: Element = this.navbar.getElementRef()
                .nativeElement.getElementsByClassName('toolbar-background')[0];
            const scrollPosition: number = event.scrollTop;
            const fadeInStartPoint = 35; // the point at which the toolbar will start fading in
            const fullOpaquePoint = 90;  // the point at which the toolbar should be fully opaque

            if (scrollPosition >= fadeInStartPoint && scrollPosition <= fullOpaquePoint) {
                // scroll points between 35 and 90 represent the opacity transition steps,
                // the opacity value should increase with each step
                const opacityTransitionSteps = fullOpaquePoint - fadeInStartPoint;
                // subtract start point so that opacity value begins from 0
                const toolbarOpacity = (scrollPosition - fadeInStartPoint) / opacityTransitionSteps;
                this.setToolbarOpacity(toolbar, toolbarOpacity);
            } else if (scrollPosition < 35) {
                this.setToolbarOpacity(toolbar, 0);
            } else if (scrollPosition > 90) {
                this.setToolbarOpacity(toolbar, 1);
            }
        });
    }
    private setToolbarOpacity(toolbar: Element, opacity: number) {
        this.renderer.setStyle(toolbar, 'opacity', opacity);
    }
    public closeFab(fab: FabContainer) {
        fab.close();
    }
    public open(url: string) {
        this.browser.create(url, '_system');
    }
}
