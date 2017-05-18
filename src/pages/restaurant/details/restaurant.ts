import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { MenuController, NavController, NavParams, Navbar, Searchbar } from "ionic-angular";
import { Logger } from "../../../app/helpers/logger";
import { Configuration } from "../../../environments/env.config";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { IRestaurant } from "../../../contracts";
import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { AppSettings } from "../../../app/services/index";
import { BasePage } from "../../index";

declare const google;

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
            transition("collapsed <=> focused", animate("300ms ease-out"))
        ]),
        trigger("searchbarState", [
            state("collapsed", style({
                "opacity": 0,
                "pointer-events": "none"
            })),
            state("focused", style({
                opacity: 1
            })),
            transition("collapsed => focused", animate("500ms ease-in")),
            transition("focused => collapsed", animate("500ms ease-out"))
        ])
        /*trigger("menuBtnTrigger", [
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
    @ViewChild("map") map: ElementRef; // TODO: move into branch tab

    restaurant: IRestaurant;
    isFavorite: boolean;
    rating: number;
    query = new BehaviorSubject<string>("");
    leavingTab = new Subject(); // because navCtrl.willLeave event doesn't fire for tabs

    searchState: string = "collapsed";
    @ViewChild("searchbar") searchbar: Searchbar;
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger,
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
        // TODO: fetch delayed restaurant details: e.g. bio
        this.data.isFavorite(this.restaurant)
            .takeUntil(this.navCtrl.viewWillLeave.merge(this.leavingTab))
            .subscribe(isFavorite => this.isFavorite = isFavorite);
    }
    ionViewDidLoad() {
        // Load map only after view is initialize
        // this.loadMap();
    }
    back() {
        this.navCtrl.parent.parent.pop();
        this.leavingTab.next();
    }
    call() {
        // TODO: open branches
    }
    toggleFavorite() {
        this.data.setFavorite(this.restaurant, !this.isFavorite);
    }
    onRateChange($event) {
        // rate change
    }
    onQueryChanged(ev: any) {
        this.query.next(ev.target.value);
    }
    onScroll(event) {
        event.domWrite(() => {
            const toolbar: Element = this.navbar.getElementRef().nativeElement.getElementsByClassName("toolbar-background")[0];
            const scrollPosition: number = event.scrollTop;
            if (scrollPosition >= 35 && scrollPosition <= 70) {
                // 55 -> 90: start fade in from point 55, should reach full opaque by point 90: 90-55=35 hence 35 steps of opacity transition
                const toolbarOpacity = (scrollPosition - 35) / 35;
                this.setElementOpacity(toolbar, toolbarOpacity);
            } else if (scrollPosition < 35) {
                this.setElementOpacity(toolbar, 0);
            } else if (scrollPosition > 70) {
                this.setElementOpacity(toolbar, 1);
            }
        });
    }
    setElementOpacity(element: Element, opacity: number) {
        this.renderer.setStyle(element, "opacity", opacity.toString());
    }
    loadMap() {
        if (google === undefined) { // failed to load google maps api due to network or whatever
            return;
        }
        const coordinates = { lat: this.restaurant.branches[0].location.latitude, lng: this.restaurant.branches[0].location.longitude };
        const map = new google.maps.Map(this.map.nativeElement, {
            center: coordinates,
            zoom: 16
        });
        const marker = new google.maps.Marker({
            position: coordinates,
            map,
            title: this.restaurant.name[0]
        });
        const infoWindow = new google.maps.InfoWindow({
            content: this.restaurant.name[0]
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
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
