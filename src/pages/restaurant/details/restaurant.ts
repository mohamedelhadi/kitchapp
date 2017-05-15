import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MenuController, NavController, NavParams, Navbar } from "ionic-angular";
import { Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Logger } from "../../../app/helpers/logger";
import { Api } from "../../../app/services/api";
import { Configuration } from "../../../environments/env.config";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { Environments } from "../../../environments/configuration";
import { IRestaurant } from "../../../contracts";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    CameraPosition,
    GoogleMapsMarkerOptions,
    GoogleMapsMarker,
    GoogleMapsMapTypeId
} from "ionic-native";

declare const google;

@Component({
    selector: "page-restaurant",
    templateUrl: "restaurant.html"
})
export class Restaurant implements OnInit {

    @ViewChild("navbar") navbar: Navbar;
    @ViewChild("map") map: ElementRef;

    restaurant: IRestaurant;
    isFavorite: boolean;
    lifeCycle = new Subject<string>();
    rating = 0;
    constructor(private menu: MenuController, private navCtrl: NavController, private navParams: NavParams, private renderer: Renderer2, private data: RestaurantsData, private config: Configuration, private logger: Logger) {
        this.restaurant = navParams.data;
        this.rating = this.restaurant.branches[0].rate.overall;
    }

    ngOnInit() {
        // init
    }

    /*ionViewDidEnter() {
    }

    ionViewDidLoad() {
    }*/

    back() {
        this.navCtrl.parent.parent.pop();
    }

    ionViewWillEnter() {
        this.data.isFavorite(this.restaurant).takeUntil(this.lifeCycle.filter(event => event === "leaving")).subscribe(isFavorite => this.isFavorite = isFavorite);
    }

    ionViewWillLeave() {
        this.lifeCycle.next("leaving");
    }

    toggleFavorite() {
        this.data.setFavorite(this.restaurant, !this.isFavorite);
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

    onRateChange($event) {
        // rate change
    }

    // Load map only after view is initialize
    ngAfterViewInit() {
        this.loadMap();
    }

    loadMap() {
        if (!google) { // failed to load google maps api due to network or whatever
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
    }
}
