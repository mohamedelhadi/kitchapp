import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MenuController, NavController, NavParams, Navbar } from "ionic-angular";
import { Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { IRestaurant } from "../../../app/contracts/interfaces";
import { Logger } from "../../../app/helpers/logger";
import { Api } from "../../../app/services/api";
import { Configuration } from "../../../environments/env.config";
import { RestaurantsData } from "../../restaurants/restaurants.data";
import { Environments } from "../../../environments/configuration";
import * as _ from "lodash";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    CameraPosition,
    GoogleMapsMarkerOptions,
    GoogleMapsMarker,
    GoogleMapsMapTypeId
} from "ionic-native";

declare var google;

@Component({
    selector: "page-restaurant",
    templateUrl: "restaurant.html"
})
export class Restaurant implements OnInit {

    @ViewChild("navbar") navbar: Navbar;
    @ViewChild("map") map: ElementRef;

    private _restaurant: IRestaurant;
    private _isFavorite: boolean;
    private _lifeCycle = new Subject<string>();
    private _rating = 0;
    constructor(private menu: MenuController, private navCtrl: NavController, private navParams: NavParams, private renderer: Renderer2, private data: RestaurantsData, private config: Configuration, private logger: Logger) {
        this._restaurant = navParams.data;
        this._rating = _.random(0, 5, true);
    }

    ngOnInit() {
    }

    /*ionViewDidEnter() {
    }

    ionViewDidLoad() {
    }*/

    back() {
        this.navCtrl.parent.parent.pop();
    }

    ionViewWillEnter() {
        this.data.isFavorite(this._restaurant).takeUntil(this._lifeCycle.filter(event => event === "leaving")).subscribe(isFavorite => this._isFavorite = isFavorite);
    }

    ionViewWillLeave() {
        this._lifeCycle.next("leaving");
    }

    toggleFavorite() {
        this.data.setFavorite(this._restaurant, !this._isFavorite);
    }

    onScroll(event) {
        event.domWrite(() => {
            let toolbar: Element = this.navbar.getElementRef().nativeElement.getElementsByClassName("toolbar-background")[0];
            let scrollPosition: number = event.scrollTop;
            if (scrollPosition >= 35 && scrollPosition <= 70) {
                // 55 -> 90: start fade in from point 55, should reach full opaque by point 90: 90-55=35 hence 35 steps of opacity transition
                let toolbarOpacity = (scrollPosition - 35) / 35;
                this._setElementOpacity(toolbar, toolbarOpacity);
            } else if (scrollPosition < 35) {
                this._setElementOpacity(toolbar, 0);
            } else if (scrollPosition > 70) {
                this._setElementOpacity(toolbar, 1);
            }
        });
    }

    _setElementOpacity(element: Element, opacity: number) {
        this.renderer.setStyle(element, "opacity", opacity.toString());
    }

    onRateChange($event) {
    }

    // Load map only after view is initialize
    ngAfterViewInit() {
        this.loadMap();
    }

    loadMap() {
        let coordinates = { lat: parseInt(this._restaurant.Location.Latitude), lng: parseInt(this._restaurant.Location.Longitude) };
        let map = new google.maps.Map(this.map.nativeElement, {
            center: coordinates,
            zoom: 16
        });
        let marker = new google.maps.Marker({
            position: coordinates,
            map,
            title: this._restaurant.Name
        });
        let infoWindow = new google.maps.InfoWindow({
            content: this._restaurant.Name
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
